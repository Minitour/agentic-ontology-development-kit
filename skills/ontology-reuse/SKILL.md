---
name: ontology-reuse
description: Search ontology registries for existing terms to reuse before defining new ones. Use during Step 2 (Knowledge Exploration) and Step 3 (Knowledge Organization), or whenever the user asks to find existing ontology terms, search OLS, look up IRIs, check if a concept already exists, or reuse external terms—e.g. "find an existing class for fatigue", "search OLS for cancer", "is there an ontology term for this?", "reuse terms from OBO Foundry".
---

# Ontology Reuse

Use this skill to **search for and evaluate existing ontology terms** before creating new ones. Reuse-over-reinvention is a core principle: always search at least one registry before defining a new class or property.

## When to Use

- **Step 2 (Knowledge Exploration)**: After extracting concepts from sources, search for each candidate concept in existing ontologies.
- **Step 3 (Knowledge Organization)**: When mapping extracted concepts to existing terminology and flagging gaps.
- **Ad-hoc lookups**: When the user asks "is there an existing term for X?", "search OLS for Y", or "find an IRI for Z".
- **Import-over-reinvention**: When multiple candidate terms from the same ontology suggest importing that ontology rather than recreating classes locally.

## Workflow

### 1. Collect candidate concepts

From the extraction table (Step 2) or user request, identify concepts that need a registry lookup.

### 2. Search OLS

Use the **ols_search** tool for each candidate concept:

```
call_tool(name: "ols_search", data: { "query": "cancer related fatigue" })
```

- Spaces are URL-encoded automatically.
- Use `page` to paginate (defaults to `"0"`).
- Results are filtered to **defining ontologies** (`isDefiningOntology=true`) and include facets by `ontologyId` and `type`.

### 3. Interpret results

The API returns JSON with this structure:

| Field | Description |
|-------|-------------|
| `page`, `totalPages`, `totalElements` | Pagination info |
| `elements[]` | Array of matching entities |
| `facetFieldsToCounts.ontologyId` | Hit counts per ontology (use to identify which ontologies are most relevant) |
| `facetFieldsToCounts.type` | Hit counts by entity type (class, individual, property, etc.) |

Each element in `elements[]` contains:

| Field | Description |
|-------|-------------|
| `iri` | Full IRI of the entity |
| `curie` | Compact URI (e.g. `SNOMED:716749005`) |
| `label` | Array of labels (preferred + alternative) |
| `ontologyId` | Source ontology identifier |
| `ontologyPreferredPrefix` | Preferred prefix for the source ontology |
| `type` | Entity types (e.g. `["class", "entity"]`) |
| `isObsolete` | Whether the term is deprecated |
| `directParent` | Direct parent IRIs |
| `directAncestor` | All ancestor IRIs |
| `linkedEntities` | Map of related entities with their labels and types |
| `shortForm` | Short form identifier (e.g. `SNOMED_716749005`) |
| `numDescendants` | Number of descendant terms |

### 4. Evaluate candidates

For each matching term, assess:

1. **Semantic fit** — Does the term's label and definition match the intended concept?
2. **Ontology provenance** — Prefer terms from well-maintained, widely-used ontologies (OBO Foundry, SNOMED, NCIt, DOID, etc.).
3. **Obsolescence** — Skip terms where `isObsolete: true`.
4. **Hierarchy fit** — Check `directParent` and `directAncestor` to see if the term's position in its source hierarchy aligns with the target ontology's structure.
5. **Type match** — Confirm the entity type matches what's needed (class vs. individual vs. property).

### 5. Report findings

Present results to the user as a table:

| Concept | Existing Term | Source | IRI | Fit | Action |
|---------|--------------|--------|-----|-----|--------|
| Cancer-related fatigue | Cancer-related fatigue | SNOMED | `SNOMED:716749005` | Exact | Reuse |
| Fatigue | Fatigue | SNOMED | `SNOMED:84229001` | Broader | Reuse as parent |
| Custom concept | — | — | — | No match | Define new |

**Action** values:
- **Reuse** — use the existing IRI directly
- **Reuse as parent** — use as a superclass for a more specific new term
- **Import** — import the source ontology (when 3+ terms from the same ontology are reused)
- **Define new** — no suitable existing term found

### 6. Apply reuse decisions

When reusing a term in the ontology (during Step 6 — Formalization):

- Add the source ontology's prefix via `add_prefix`
- Reference the term by its full IRI or CURIE in axioms
- If importing the whole ontology, add an `Import(...)` axiom with the canonical IRI
- Add `AnnotationAssertion(rdfs:seeAlso ...)` or provenance annotations linking to the source

## Pagination

When results span multiple pages, use the `page` parameter:

```
call_tool(name: "ols_search", data: { "query": "fatigue", "page": "1" })
```

Check `totalPages` in the response to know how many pages are available. The `facetFieldsToCounts.ontologyId` facet (returned on every page) shows the total hit distribution across ontologies — use it to decide whether to filter by a specific ontology in a follow-up search.

## Complementary Registries

OLS covers OBO Foundry, EFO, SNOMED, and many biomedical ontologies. For broader coverage, also consider manual searches on:

- **OBO Foundry** — <http://obofoundry.org>
- **BioPortal** — <https://bioportal.bioontology.org>
- **OntoBee** — <http://ontobee.org>
- **LOV (Linked Open Vocabularies)** — <https://lov.linkeddata.es>

## Tool Requirement

This skill requires: **ols_search**

After learning this skill, call `setup_tools(skills: ["ontology-reuse"])` to activate the tool, then use `call_tool(name: "ols_search", data: {"query": "...", "page": "0"})` to invoke it.
