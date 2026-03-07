---
name: odk-sssom
description: Validate, convert, or merge SSSOM (Simple Standard for Sharing Ontology Mappings) files. Use whenever the user works with ontology mappings in TSV/CSV—e.g. "validate my SSSOM file", "convert mappings to JSON", "merge mapping files". Output is validation report, converted mappings, or merged file. Do not use for ROBOT merge or template; use odk-robot for those.
---

# ODK SSSOM Skill

Use this skill when the user needs to work with **SSSOM mapping files** (e.g. TSV, CSV of entity mappings): **validate** them, **convert** between formats, or **merge** multiple mapping files. Paths are relative to the project root.

## When to Use This Skill (by outcome)

- User wants to **validate** a SSSOM file (syntax, required columns) → use **odk_sssom** with `validate` and the file path.
- User wants to **convert** mappings to another format → use **odk_sssom** with the appropriate convert/export arguments.
- User wants to **merge** several mapping files into one → use **odk_sssom** with merge arguments.

## What the Tool Does and How It Works

**What it does**: Runs **sssom** (SSSOM-PY) in the ODK environment. Validates, converts, or merges SSSOM mapping files. Output is validation result, converted file, or merged file.

**How it works**: Pass the full sssom argument string to **odk_sssom** via `args`. Common: `validate mappings.tsv`, `convert --input mappings.tsv --output mappings.json`. Working directory is the project root.

## Examples (calling the tool)

- Validate: **odk_sssom** with `args`: `validate mappings.tsv`
- Convert: **odk_sssom** with `args**: `convert --input mappings.tsv --output mappings.json` (adjust to actual sssom CLI)
- Version: **odk_sssom** with `args`: `--version`

## When Not to Use This Skill

- **ROBOT** (merge ontologies, template) → use **odk-robot**. **sssom-cli** (if different from sssom) → use **odk-run** with the full command if not covered here.

## Tool and Arguments

| Argument | Type   | Required | Description |
|----------|--------|----------|-------------|
| **args** | string | yes      | Full sssom arguments (e.g. `validate mappings.tsv`, `convert --input m.tsv --output m.json`). Paths relative to project root. |

## Tool Requirement

This skill requires: **odk_sssom**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
