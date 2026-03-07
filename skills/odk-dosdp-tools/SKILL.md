---
name: odk-dosdp-tools
description: Generate or migrate ontology terms from design patterns (YAML template + CSV/data). Use whenever the user works with DOSDP patterns—e.g. "generate terms from this YAML and CSV", "run dosdp-tools". Output is generated OWL or updated terms. For ROBOT template (CSV + ROBOT template) use odk-robot.
---

# ODK DOSDP-Tools Skill

Use this skill when the user needs **dosdp-tools** to **generate ontology content** from design patterns: a YAML template plus CSV (or other data). Typical outcome is a generated OWL file or mergeable terms. Paths are relative to the project root.

## When to Use This Skill (by outcome)

- User wants to **generate new terms** from a pattern (YAML + CSV) → use **odk_dosdp_tools** with `generate` and `--template`, `--ontology`, data, `--outfile`.
- User wants to **migrate** or transform terms using a pattern → use **odk_dosdp_tools** with the appropriate dosdp-tools subcommand and arguments.
- User wants other **dosdp-tools** operations (see `dosdp-tools --help`) → use **odk_dosdp_tools** with the full argument string.

## What the Tool Does and How It Works

**What it does**: Runs **dosdp-tools** (Design Pattern Structured Data Processing) in the ODK environment. Produces generated OWL or updated ontology files from templates and data.

**How it works**: Pass the full dosdp-tools argument string to **odk_dosdp_tools** via the `args` parameter. Working directory is the project root; use relative paths for template, ontology, and output.

## Examples (calling the tool)

- Generate from pattern: **odk_dosdp_tools** with `args`: `generate --template=templates/pattern.yaml --ontology=edit.owl --outfile=generated.owl`
- With CSV input: **odk_dosdp_tools** with `args`: `generate --template=templates/terms.yaml --ontology=edit.owl --infile=terms.csv --outfile=terms.owl`
- Version: **odk_dosdp_tools** with `args`: `--version`

## When Not to Use This Skill

- **ROBOT template** (CSV + ROBOT template) → use **odk-robot** and **odk_robot** with `template` subcommand.
- **owltools, riot, sparql, runoak, sssom, etc.** → use the corresponding odk-* skill or **odk-run**.

## Tool and Arguments

| Argument | Type   | Required | Description |
|----------|--------|----------|-------------|
| **args** | string | yes      | Full dosdp-tools arguments (e.g. `generate --template t.yaml --ontology edit.owl --outfile out.owl`). Paths relative to project root. |

## Tool Requirement

This skill requires: **odk_dosdp_tools**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
