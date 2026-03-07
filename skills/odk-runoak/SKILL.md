---
name: odk-runoak
description: Search and navigate ontologies with runoak (OAKLIB). Use whenever the user wants to search terms by label/keyword, get ancestors or descendants of a term, or list/browse ontology structure—e.g. "find terms containing X", "ancestors of GO:0008150", "show hierarchy". Output is term list, hierarchy, or search results. For SPARQL over RDF use odk-sparql; for ROBOT query use odk-robot.
---

# ODK Runoak Skill

Use this skill when the user needs **runoak** (OAKLIB – Ontology Access Kit) to **search** terms, get **ancestors/descendants**, or **navigate** an ontology (e.g. by label, ID, or hierarchy). Paths are relative to the project root.

## When to Use This Skill (by outcome)

- User wants to **search** an ontology by label or keyword → use **odk_runoak** with `search` and the ontology path and query.
- User wants **ancestors** or **descendants** of a term → use **odk_runoak** with the appropriate subcommand and term ID or label.
- User wants to **list terms**, **get definitions**, or other OAKLIB operations → use **odk_runoak** with the full argument string.

## What the Tool Does and How It Works

**What it does**: Runs **runoak** (OAKLIB) in the ODK environment. Queries and navigates ontologies: search, ancestors, descendants, term info. Output is text (term lists, hierarchy, or search results).

**How it works**: Pass the full runoak argument string to **odk_runoak** via `args`. Common: `-i <ontology>` for input, then subcommand (e.g. `search "heart"`, `ancestors TERM:123`). Working directory is the project root.

## Examples (calling the tool)

- Search: **odk_runoak** with `args`: `-i edit.owl search "heart"`
- Ancestors: **odk_runoak** with `args`: `-i edit.owl ancestors GO:0008150`
- Version: **odk_runoak** with `args`: `--help`

## When Not to Use This Skill

- **SPARQL** over RDF → use **odk-sparql**. **ROBOT query** → use **odk-robot** and **odk_robot** with `query`.

## Tool and Arguments

| Argument | Type   | Required | Description |
|----------|--------|----------|-------------|
| **args** | string | yes      | Full runoak arguments (e.g. `-i edit.owl search "term"`, `-i edit.owl ancestors TERM:123`). Paths relative to project root. |

## Tool Requirement

This skill requires: **odk_runoak**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
