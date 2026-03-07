---
name: odk-riot
description: Convert between RDF formats (RDF/XML, Turtle, N-Triples, JSON-LD) or validate RDF. Use whenever the user wants to convert an ontology/RDF file to another format or check RDF well-formedness—e.g. "convert OWL to Turtle", "validate this RDF". Output is converted file or validation result. For ROBOT OWL↔OBO or OWL functional use odk-robot.
---

# ODK Riot Skill

Use this skill when the user needs **riot** (Apache Jena RDF I/O) to **convert** RDF between formats (e.g. RDF/XML → Turtle, OWL → Turtle) or **validate** RDF syntax. Paths are relative to the project root.

## When to Use This Skill (by outcome)

- User wants to **convert** an ontology/RDF file to another format (Turtle, N-Triples, JSON-LD, etc.) → use **odk_riot** with input file and `--output` or redirect.
- User wants to **validate** RDF (check well-formedness) → use **odk_riot** with the file path; riot will report errors if invalid.

## What the Tool Does and How It Works

**What it does**: Runs **riot** in the ODK environment. Reads RDF from file(s) and writes converted output or validates. Supports RDF/XML, Turtle, N-Triples, JSON-LD, and other Jena formats.

**How it works**: Pass the full riot argument string to **odk_riot** via `args`. Working directory is the project root. For conversion, use e.g. `--output=ttl edit.owl` or equivalent.

## Examples (calling the tool)

- Convert OWL to Turtle: **odk_riot** with `args`: `--output=ttl edit.owl > edit.ttl` (or `--output ttl edit.owl` and capture stdout)
- Validate: **odk_riot** with `args`: `edit.owl`
- Version: **odk_riot** with `args`: `--version`

## When Not to Use This Skill

- **ROBOT convert** (OWL ↔ OBO, OWL functional) → use **odk-robot** and **odk_robot** with `convert`.
- **SPARQL queries** → use **odk-sparql** and **odk_sparql**.

## Tool and Arguments

| Argument | Type   | Required | Description |
|----------|--------|----------|-------------|
| **args** | string | yes      | Full riot arguments (e.g. `--output=ttl edit.owl`, `edit.owl`). Paths relative to project root. |

## Tool Requirement

This skill requires: **odk_riot**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
