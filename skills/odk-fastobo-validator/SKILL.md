---
name: odk-fastobo-validator
description: Validate OBO-format files for syntax and structure. Use whenever the user has .obo files or OBO-style content to check—e.g. "validate this OBO file", "check OBO syntax". Output is pass or list of errors. For OWL/RDF validation use odk-robot or odk-riot.
---

# ODK Fastobo-Validator Skill

Use this skill when the user needs to **validate files in OBO format** (e.g. `.obo` or OBO-style content). The tool checks syntax and structure and reports errors or success. Paths are relative to the project root.

## When to Use This Skill (by outcome)

- User wants to **check that an OBO file is valid** (syntax, structure) → use **odk_fastobo_validator** with the file path(s).
- User wants **validation errors** listed for fixing → use **odk_fastobo_validator**; output will indicate where the file fails validation.

## What the Tool Does and How It Works

**What it does**: Runs **fastobo-validator** in the ODK environment. Validates OBO-format input and exits with success or reports errors to stderr/stdout.

**How it works**: Pass the path(s) to the file(s) to validate as **odk_fastobo_validator** `args`. Working directory is the project root (e.g. `args`: `edit.obo` or `src/ontology/edit.obo`).

## Examples (calling the tool)

- Validate one file: **odk_fastobo_validator** with `args`: `edit.obo`
- Validate multiple: **odk_fastobo_validator** with `args`: `file1.obo file2.obo`

## When Not to Use This Skill

- **OWL validation** (RDF/OWL format) → use **odk-robot** `validate-profile` or **odk_robot** verify, or **odk-riot** for RDF.
- **ROBOT verify** (rule-based QC) → use **odk-robot** and **odk_robot** with `verify`.

## Tool and Arguments

| Argument | Type   | Required | Description |
|----------|--------|----------|-------------|
| **args** | string | yes      | File path(s) to validate (e.g. `edit.obo`). Paths relative to project root. |

## Tool Requirement

This skill requires: **odk_fastobo_validator**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
