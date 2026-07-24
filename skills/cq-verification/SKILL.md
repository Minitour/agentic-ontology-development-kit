---
name: cq-verification
description: Verify competency questions against an OWL ontology using SPARQL queries with test data. Use to verify every CQ with real query execution. Also use whenever the user asks to test, validate, or verify an ontology against its CQs, run SPARQL verification, check CQ coverage, or asks "does the ontology answer the competency questions?"—e.g. "verify CQs", "test the ontology", "run CQ checks", "validate against competency questions".
---

# CQ Verification Skill

Use this skill during **Step 7 (Automated Review)** to verify that the ontology can answer every competency question.

## The Core Problem This Solves

A common mistake is running SPARQL queries against hand-crafted test triples without loading the ontology schema. This only tests whether the test data was constructed correctly — not whether the ontology itself supports the queries. For example, a query like `?x :relatedTo ?y` will succeed against raw triples that contain that pattern, even if the ontology doesn't define `:relatedTo` at all.

To truly verify the ontology, queries must run against a model that contains **both** the ontology schema (classes, properties, axioms) and test individuals. The owl-mcp `sparql_query` tool provides this directly: pass **both** the ontology file and the test-data file as `owl_file_paths` and it loads them together into a single in-memory store, making class hierarchies, domains/ranges, and equivalences available to the query engine — no separate merge step is needed.

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

**Do not add `Import(...)` axioms to this file.** Import statements require either a resolvable URL or an XML catalog mapping the IRI to a local path. Since ontology IRIs like `http://example.org/...` are not real URLs, the import will silently fail — the test data would load without the ontology schema, and queries would pass trivially by pattern matching. Instead, pass both files to `sparql_query` in Phase 2, which loads them together by local path.

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

- **Schema/hierarchy** ("Which subtypes of X exist?"): uses `rdfs:subClassOf` from the ontology — this is why loading the ontology alongside the test data matters (and why `with_reasoning: true` helps when inferred subclasses are needed)

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

### Phase 1.5 — Pre-flight: Validate OWL File

Read the first ~15 lines of the ontology OWL file and check for these issues, which prevent the file from parsing correctly:

1. **CURIEs in the `Ontology(...)` header** — The `Ontology(...)` declaration must use full IRIs in angle brackets, not CURIEs.

   Bad: `Ontology(ex: ex:1.0`
   Good: `Ontology(<http://example.org/my-ontology/> <http://example.org/my-ontology/1.0>`

2. **CURIEs in `Import(...)` statements** — Import IRIs must be full IRIs in angle brackets.

   Bad: `Import(obo:bfo.owl)`
   Good: `Import(<http://purl.obolibrary.org/obo/bfo.owl>)`

3. **Bare CURIEs as annotation subjects** — When the ontology itself is the subject of an `AnnotationAssertion`, the subject must be the full IRI, not a bare prefix like `ex:`.

   Bad: `AnnotationAssertion(rdfs:label ex: "My Ontology")`
   Good: `AnnotationAssertion(rdfs:label <http://example.org/my-ontology/> "My Ontology")`

**If any of these are found**, fix them before proceeding:

- Use `set_ontology_iri` with the **full IRI** (not a CURIE) to fix the `Ontology(...)` header. If `set_ontology_iri` does not rewrite the file correctly, report the issue to the user — do not proceed with a malformed file.
- For `Import(...)` and `AnnotationAssertion` issues, use `remove_axiom` to remove the broken axiom and `add_axiom` to re-add it with the full IRI in angle brackets.

**Why this matters:** The ontology-editor tools (owl-mcp) produce OWL functional syntax. If the agent passed CURIEs instead of full IRIs to `set_ontology_iri` or to `Import(...)` axioms during formalization, the resulting file will look valid but fail to parse. Fix the source syntax first.

### Phase 2 — Execute Queries

Use owl-mcp's `sparql_query` tool. Pass **both** the ontology file and the test-data file in `owl_file_paths` — owl-mcp loads them together into one in-memory store, so no separate merge step or merged artifact is needed. Use **absolute paths**.

Run one query per call, passing the contents of each `.rq` file as the `query` string:

```
call_tool(name: "sparql_query", data: {
  "owl_file_paths": [
    "C:/.../projects/<project_dir>/ontology/<name>.owl",
    "C:/.../projects/<project_dir>/queries/test-data.owl"
  ],
  "query": "PREFIX : <http://example.org/my-ontology#>\nSELECT ?item ?name WHERE { ?item :belongsTo :category1 . ?item :hasName ?name . }"
})
```

`SELECT`/`ASK` return SPARQL 1.1 JSON results directly in the tool response — there is no CSV output file to read.

**CLI fallback (no MCP client needed):** If the MCP tools are unavailable, run the same query from the terminal — repeat `--owl-file-paths` once per file, and pass the query string with `--query`:

```bash
capa sh owl sparql-query \
  --owl-file-paths "C:/abs/projects/<project_dir>/ontology/<name>.owl" \
  --owl-file-paths "C:/abs/projects/<project_dir>/queries/test-data.owl" \
  --with-reasoning false \
  --query "PREFIX : <http://example.org/my-ontology#> SELECT ?item WHERE { ?item :belongsTo :category1 }"
```

**For CQs that depend on inferred subsumption or defined-class classification** (e.g. "which subtypes of X exist?", or a defined `EquivalentClasses` category), set `"with_reasoning": true` so owl-mcp materializes OWL 2 EL entailments before querying. Leave it off (default) for plain assertion-matching queries.

**What results mean:**

- **Bindings with expected individuals** → the ontology supports this CQ. Pass.
- **Empty result set** → either the test data is missing the necessary assertions, or the ontology is missing a class/property. Investigate which.
- **Query error** (syntax error, unknown prefix) → fix the `.rq` file and re-run.

**When something fails:**

- Fix the root cause (query, test data, or ontology)
- If the ontology itself needed changes, return to Step 6 (formalization) to apply them via ontology-editor tools, then re-run the affected queries — `sparql_query` always reads the current files, so there is no stale merged artifact to rebuild

### Phase 3 — Report

Present results as a summary table covering every CQ:

| CQ | Question | Query File | Result | Notes |
|----|----------|------------|--------|-------|
| CQ01 | What items belong to a given category? | CQ01.rq | PASS (1 row) | Returned item1 |
| CQ02 | Who created a given item? | CQ02.rq | FAIL (0 rows) | Missing createdBy in test data |

Every CQ must appear in the table. If any CQ fails due to an ontology gap, fix the ontology and re-run.

## Common Pitfalls

### `sparql_query` fails to parse the ontology

This almost always means CURIEs were used where full IRIs are required (see **Phase 1.5**). Run the pre-flight checks and fix the source syntax with the ontology-editor tools. Never copy axioms between files via `get_all_axioms` + `add_axioms` as a workaround — this defeats schema-aware verification.

### Querying test data alone

Always pass **both** the ontology and the test-data file in `owl_file_paths`. Querying the test data by itself only checks that the triples were constructed correctly, not that the ontology supports them.

### Missing entailments

If a CQ relies on inferred subclasses or a defined (`EquivalentClasses`) category and the query returns nothing, re-run it with `"with_reasoning": true` — the default runs over asserted triples only.

### Clean Up

The test data and `.rq` query files are project deliverables — keep them. `sparql_query` produces no intermediate merged file, so there are no build artifacts to clean up.
