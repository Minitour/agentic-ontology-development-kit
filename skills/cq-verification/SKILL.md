---
name: cq-verification
description: Verify competency questions against an OWL ontology using SPARQL queries with test data. Use to verify every CQ with real query execution. Also use whenever the user asks to test, validate, or verify an ontology against its CQs, run SPARQL verification, check CQ coverage, or asks "does the ontology answer the competency questions?"—e.g. "verify CQs", "test the ontology", "run CQ checks", "validate against competency questions".
---

# CQ Verification Skill

Use this skill during **Step 7 (Automated Review)** to verify that the ontology can answer every competency question.

## The Core Problem This Solves

A common mistake is running SPARQL queries against hand-crafted test triples without loading the ontology schema. This only tests whether the test data was constructed correctly — not whether the ontology itself supports the queries. For example, a query like `?x :relatedTo ?y` will succeed against raw triples that contain that pattern, even if the ontology doesn't define `:relatedTo` at all.

To truly verify the ontology, queries must run against a file that contains **both** the ontology schema (classes, properties, axioms) and test individuals. This is what `robot merge` provides — it loads both files by local path into a single in-memory model, making class hierarchies, domains/ranges, and equivalences available to the query engine.

## Procedure

### Phase 0 — Plan and Create Test Data

Before writing any individuals, read the CQ list from the approved proposal and **plan the test data**. For each CQ, note which classes and properties it exercises, and which individuals and assertions are needed to produce a non-empty result.

A quick planning table helps (you don't need to write this to a file — it's a mental model):

| CQ | Needs individuals of | Needs property assertions |
|----|---------------------|--------------------------|
| CQ01: What items belong to a given category? | :Item, :Category | :belongsTo |
| CQ02: Who created a given item? | :Item, :Person | :createdBy |

This planning step prevents two common problems: (1) creating individuals that no query uses, and (2) missing assertions that leave queries returning empty results.

**Create the test data file** at `projects/<project_dir>/queries/test-data.owl` using the ontology-editor tools:

1. Call `setup_tools(skills: ["cq-verification"])` to activate tools
2. Call `set_ontology_iri` on the test data file with a distinct IRI (e.g. append `/test-data` to the main ontology's namespace)
3. Add the same prefixes as the main ontology using `add_prefix`
4. Add test individuals using `add_axioms` — declarations, class assertions, and property assertions

Example axioms (OWL functional syntax):

```
Declaration(NamedIndividual(:item1))
ClassAssertion(:Item :item1)
DataPropertyAssertion(:hasName :item1 "Example Item")
ObjectPropertyAssertion(:belongsTo :item1 :category1)
```

**Do not add `Import(...)` axioms to this file.** Import statements require either a resolvable URL or an XML catalog mapping the IRI to a local path. Since ontology IRIs like `http://example.org/...` are not real URLs, the import will silently fail — ROBOT will load the test data without the ontology schema, and queries will pass trivially by pattern matching. Use `robot merge` in Phase 2 instead, which loads both files by local path.

Keep the test data **minimal** — only the individuals and assertions needed by the CQs. One or two individuals per class is usually enough.

### Phase 1 — Write All Queries

For every CQ in the approved proposal (section 2), write a SPARQL SELECT query. Save each as `projects/<project_dir>/queries/CQnn.rq` (e.g. `CQ01.rq`, `CQ02.rq`).

Each `.rq` file should:

1. Start with a comment containing the CQ text: `# CQ01: What items belong to a given category?`
2. Declare all necessary prefixes
3. Use a concrete test individual as the "given" entity (e.g. `:category1` from the test data)
4. SELECT the variables that answer the question

**Common query patterns:**

- **Binary relationship** ("Which X belongs to Y?"): straightforward triple pattern

```sparql
# CQ01: What items belong to a given category?
PREFIX : <http://example.org/my-ontology#>
SELECT ?item ?name WHERE {
  ?item :belongsTo :category1 .
  ?item :hasName ?name .
}
```

- **Data property** ("What is the name of X?"): match a literal value

```sparql
# CQ02: What is the name of a given item?
PREFIX : <http://example.org/my-ontology#>
SELECT ?name WHERE {
  :item1 :hasName ?name .
}
```

- **Type/classification** ("What kind of X is this?"): check `rdf:type`

```sparql
# CQ03: What type is a given item?
PREFIX : <http://example.org/my-ontology#>
SELECT ?type WHERE {
  :item1 a ?type .
  FILTER(?type IN (:TypeA, :TypeB))
}
```

- **Schema/hierarchy** ("Which subtypes of X exist?"): uses `rdfs:subClassOf` from the ontology — this is why the merge step matters

```sparql
# CQ04: Which subtypes of Role exist?
PREFIX : <http://example.org/my-ontology#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?subtype ?label WHERE {
  ?subtype rdfs:subClassOf :Role .
  OPTIONAL { ?subtype rdfs:label ?label }
}
```

**Write all query files before executing any.** This prevents the pattern of writing one, running it, getting distracted, and never finishing the rest.

### Phase 2 — Execute Queries

Use `odk_robot` to merge the ontology with the test data, then run each query against the merged result.

**Step 1 — Merge ontology + test data:**

```
call_tool(name: "odk_robot", data: {
  "robot_args": "merge --input ontology/<name>.owl --input queries/test-data.owl --output queries/merged.owl",
  "project_dir": "projects/<project_dir>"
})
```

The merge produces a single file with both TBox and ABox. Paths in `robot_args` are relative to the project directory.

**Step 2 — Run each query:**

```
call_tool(name: "odk_robot", data: {
  "robot_args": "query --input queries/merged.owl --query queries/CQ01.rq queries/results/CQ01.csv",
  "project_dir": "projects/<project_dir>"
})
```

Read each output CSV to check the results. Run every query.

**What results mean:**

- **Rows with expected individuals** → the ontology supports this CQ. Pass.
- **Zero rows** → either the test data is missing the necessary assertions, or the ontology is missing a class/property. Investigate which.
- **Query error** (syntax error, unknown prefix) → fix the `.rq` file and re-run.

**When something fails:**

- Fix the root cause (query, test data, or ontology)
- After any change to the ontology or test data, **always re-run the merge** before re-running queries — the merged file is stale otherwise
- If the ontology itself needed changes, return to Step 6 (formalization) to apply them via ontology-editor tools

### Phase 3 — Report

Present results as a summary table covering every CQ:

| CQ | Question | Query File | Result | Notes |
|----|----------|------------|--------|-------|
| CQ01 | What items belong to a given category? | CQ01.rq | PASS (1 row) | Returned item1 |
| CQ02 | Who created a given item? | CQ02.rq | FAIL (0 rows) | Missing createdBy in test data |

Every CQ must appear in the table. If any CQ fails due to an ontology gap, fix the ontology and re-run.

### Clean Up

After all CQs pass, delete `queries/merged.owl` — it is a build artifact. Keep the test data and query files as project deliverables.
