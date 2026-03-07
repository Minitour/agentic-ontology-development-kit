---
name: odk-sparql
description: Run SPARQL queries against an ontology or RDF file and get result sets. Use whenever the user wants to execute SELECT/ASK/CONSTRUCT, export query results to CSV/JSON, or query RDF data—e.g. "run this SPARQL", "query the ontology". For ROBOT query subcommand or template use odk-robot; for term search/hierarchy use odk-runoak.
---

# ODK Sparql Skill

Use this skill when the user needs to **run SPARQL queries** against an ontology or RDF file and get **query results** (e.g. bindings, CSV). Paths are relative to the project root. For ROBOT’s rule-based or template workflows use **odk-robot** instead.

## When to Use This Skill (by outcome)

- User wants to **execute a SPARQL SELECT/ASK/CONSTRUCT** over an ontology file → use **odk_sparql** with `--query` and `--data` (or equivalent arguments for the sparql command).
- User wants **query results** exported (e.g. to CSV) → use **odk_sparql** with the appropriate output options.

## What the Tool Does and How It Works

**What it does**: Runs the **sparql** command (Jena/ODK) in the ODK environment. Executes a SPARQL query file against an RDF/ontology file and outputs the result set.

**How it works**: Pass the full sparql argument string to **odk_sparql** via `args`. Typically: query file path, data file path, and optionally output file or format. Working directory is the project root.

## Examples (calling the tool)

- Run query: **odk_sparql** with `args`: `--query=query.rq --data=edit.owl`
- With output file: **odk_sparql** with `args`: `--query query.rq --data edit.owl results.csv` (or as the sparql CLI expects)

## When Not to Use This Skill

- **ROBOT query** (integrated with ROBOT pipeline) → use **odk-robot** and **odk_robot** with `query` subcommand.
- **RDF conversion** → use **odk-riot**. **Ontology term search** → consider **odk-runoak**.

## Tool and Arguments

| Argument | Type   | Required | Description |
|----------|--------|----------|-------------|
| **args** | string | yes      | Full sparql arguments (e.g. `--query query.rq --data edit.owl`). Paths relative to project root. |

## Tool Requirement

This skill requires: **odk_sparql**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
