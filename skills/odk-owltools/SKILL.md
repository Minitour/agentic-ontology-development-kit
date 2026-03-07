---
name: odk-owltools
description: Run OWL reasoning (classify, infer axioms), merge OWL files, or extract subsets via owltools. Use when the user wants OWL API–based operations—e.g. "run reasoner with ELK", "merge OWL with owltools", "extract subset". Output is reasoned/merged/extracted ontology. For ROBOT (verify, merge, reason, convert, template, query) use odk-robot.
---

# ODK Owltools Skill

Use this skill when the user needs **owltools** to get: **reasoning/classification** (e.g. run a reasoner and output inferred axioms), **merge** of OWL files, **extract** of a subset, or other **OWL API operations**. Paths are relative to the project root. For ROBOT use **odk-robot** instead.

## When to Use This Skill (by outcome)

- User wants **OWL reasoning** (ELK, HermiT, etc.) and inferred axioms or classified ontology → use **odk_owltools** with args for `--reasoner`, `--run-reasoner`, output file.
- User wants to **merge** two or more OWL files with owltools (rather than ROBOT merge) → use **odk_owltools** with `--merge` and input/output paths.
- User wants to **extract** a subset (e.g. by term list or reasoning query) → use **odk_owltools** with the appropriate extract options.
- User wants other **owltools** operations (see `owltools --help`) → use **odk_owltools** with the full argument string.

## What the Tool Does and How It Works

**What it does**: Runs **owltools** (OWL API–based utilities) in the ODK environment. Produces output files (reasoned ontology, merged ontology, extracted subset) or validation/report output depending on the arguments.

**How it works**: Pass the full owltools argument string to **odk_owltools** via the `args` parameter. Working directory is the project root; use relative paths (e.g. `edit.owl`, `ontology/edit.owl`).

## Examples (calling the tool)

- Reason with ELK and write inferred axioms: **odk_owltools** with `args`: `edit.owl --reasoner elk --run-reasoner --assert-inferred-subclass-axioms -o reasoned.owl`
- Merge two files: **odk_owltools** with `args`: `--merge edit.owl import.owl -o merged.owl`
- Version: **odk_owltools** with `args`: `--version`

## When Not to Use This Skill

- **ROBOT** (verify, merge, reason, convert, template, query) → use **odk-robot** and **odk_robot**.
- **dosdp-tools, fastobo-validator, riot, sparql, runoak, sssom** → use the corresponding odk-* skill.
- **Custom make or other ODK tools** → use **odk-run** and **odk_run**.

## Tool and Arguments

| Argument | Type   | Required | Description |
|----------|--------|----------|-------------|
| **args** | string | yes      | Full owltools arguments (e.g. `edit.owl --reasoner elk --run-reasoner -o reasoned.owl`). Paths relative to project root. |

## Tool Requirement

This skill requires: **odk_owltools**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
