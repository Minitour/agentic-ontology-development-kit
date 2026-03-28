---
name: odk-robot
description: Run ROBOT for ontology QC, merge, reason, convert, template, or query. Use whenever the user needs to verify an ontology, validate OWL profile, merge OWL files, run a reasoner, convert OWL/OBO, build terms from CSV+template, or run SPARQL/DL over an ontology—e.g. "run robot verify", "merge these OWL files", "convert to OBO", "template from this CSV". This is the only skill for ROBOT; do not use odk-run for robot.
---

# ODK Robot Skill

Use this skill when the user needs to **run ROBOT** for: **verify** (rule-based QC), **validate** OWL 2 profile, **merge** ontologies, **reason** (classification/inference), **convert** format (OWL ↔ OBO etc.), **template** (generate terms from CSV + template), or **query** (SPARQL or DL). **Use the odk_robot tool** (activate with `setup_tools(skills: ["odk-robot"])`, then `call_tool(name: "odk_robot", data: {...})`)—do not run `robot` via shell or **odk_run**. This is the only way to run ROBOT in this project.

**Paths**: The ODK Docker wrapper mounts a project directory at `/work`. Paths in `robot_args` are **relative to that mounted root**.

- **Workspace ontology** (no `project_dir`): Omit or leave `project_dir` empty. The current working directory is mounted; paths are relative to it (e.g. `ontology/edit.owl`).
- **Cloned project** under `projects/<slug>/`: Pass **`project_dir`** = the clone root (e.g. `projects/owner-repo`). Paths in `robot_args` are then relative to the clone root (e.g. `ontology/edit.owl` or the edit file path in the project). **Always use the built-in odk_robot tool with project_dir** for clones—do not run `node scripts/odk-docker-run.js` manually from the shell.

## When to Use This Skill (by outcome)

- User wants **QC / rule checks** on an OWL file → use **verify**.
- User wants to **check OWL 2 profile** (e.g. DL) → use **validate-profile**.
- User wants a **single merged OWL file** from several inputs → use **merge**.
- User wants **reasoning** (classification, consistency, inferred axioms) → use **reason**.
- User wants **format conversion** (e.g. OWL to OBO, RDF/XML to functional) → use **convert**.
- User wants to **generate or update terms** from a ROBOT template and CSV → use **template**.
- User wants to **run a SPARQL or DL query** and get results → use **query**.
- User wants **other ROBOT subcommands** (annotate, extract, filter, report, etc.) → use **odk_robot** with the appropriate `robot_args`.

## What Each ROBOT Subcommand Does and How to Use It

### verify

**What it does**: Runs rule-based checks on an ontology (e.g. required annotations, logical consistency). Produces a report of violations or success.

**How it works**: `robot verify --input <path> [--output report.txt] [other options]`. Paths relative to project root.

**Example** (verify and write report):
```text
robot verify --input edit.owl --output report.txt
```
**odk_robot** call: `robot_args` = `verify --input edit.owl --output report.txt`

**Example** (verify only, no output file):
```text
robot verify --input upper-level/bfo.owl
```

---

### validate-profile

**What it does**: Checks whether the ontology conforms to an OWL 2 profile (e.g. OWL 2 DL). Outputs profile validation result.

**How it works**: `robot validate-profile --input <path> [--profile DL]`. Paths relative to project root.

**Example**:
```text
robot validate-profile --input edit.owl --profile DL
```
**odk_robot** call: `robot_args` = `validate-profile --input edit.owl --profile DL`

---

### merge

**What it does**: Merges two or more OWL files into one ontology. Output is a single OWL file.

**How it works**: `robot merge --inputs <file1> <file2> ... --output <out.owl>`. Paths relative to project root.

**Example**:
```text
robot merge --inputs upper-level/bfo.owl upper-level/sulo.owl edit.owl --output merged.owl
```
**odk_robot** call: `robot_args` = `merge --inputs upper-level/bfo.owl upper-level/sulo.owl edit.owl --output merged.owl`

---

### reason

**What it does**: Runs a reasoner (e.g. ELK, HermiT) to classify the ontology and optionally output inferred axioms. Produces a reasoned ontology and/or consistency result.

**How it works**: `robot reason --input <path> [--reasoner elk|hermit] --output reasoned.owl [--annotate-inferred-axioms true]`. Paths relative to project root.

**Example** (reason with ELK, output inferred axioms):
```text
robot reason --input edit.owl --reasoner elk --output reasoned.owl --annotate-inferred-axioms true
```
**odk_robot** call: `robot_args` = `reason --input edit.owl --reasoner elk --output reasoned.owl --annotate-inferred-axioms true`

---

### convert

**What it does**: Converts between ontology formats (e.g. RDF/XML, OWL functional, OBO). Output is a file in the requested format.

**How it works**: `robot convert --input <path> --output <path> [--format obo|owl|ofn|owlxml|rdfxml|turtle]`. Paths relative to project root.

**Example** (OWL to OBO):
```text
robot convert --input edit.owl --output edit.obo --format obo
```
**odk_robot** call: `robot_args` = `convert --input edit.owl --output edit.obo --format obo`

**Example** (OWL to OWL functional):
```text
robot convert --input edit.owl --output edit.owl --format ofn
```

---

### template

**What it does**: Builds or updates ontology terms from a ROBOT template (CSV + template YAML). Output is an ontology or mergeable file with generated axioms.

**How it works**: `robot template --template <template.yaml> --input <data.csv> [--output output.owl]`. Paths relative to project root.

**Example**:
```text
robot template --template templates/terms.yaml --input terms.csv --output terms.owl
```
**odk_robot** call: `robot_args` = `template --template templates/terms.yaml --input terms.csv --output terms.owl`

---

### query

**What it does**: Runs a SPARQL or DL query over an ontology and writes results (e.g. to CSV). Output is the query result file.

**How it works**: `robot query --input <ontology> --query <query.rq|query.sparql> <results.csv>`. Paths relative to project root.

**Example** (SPARQL):
```text
robot query --input edit.owl --query query.rq results.csv
```
**odk_robot** call: `robot_args` = `query --input edit.owl --query query.rq results.csv`

---

### Other subcommands

**annotate**, **extract**, **filter**, **report**, **remove**, **rename**, **repair**, **collapse**, **expand**, **diff**, **explain**, **materialize**, **measure**, **mirror**, **reduce**, **relax**, **unmerge**, etc. Use **odk_robot** with `robot_args` set to the full robot command (e.g. `extract --input edit.owl --term-file terms.txt --output subset.owl`). See [ROBOT documentation](http://robot.obolibrary.org/) for each subcommand.

**Example** (extract subset):
```text
robot extract --input edit.owl --term-file terms.txt --output subset.owl
```
**odk_robot** call: `robot_args` = `extract --input edit.owl --term-file terms.txt --output subset.owl`

---

## When Not to Use This Skill

- **owltools, dosdp-tools, riot, sparql, runoak, sssom, etc.** → use **odk-run** and **odk_run**.
- **Seeding a new ODK repo** → use **odk-seed** and **odk_seed**.
- **ODK Make targets** (test, prepare_release, refresh-imports, update_repo, odkversion) → use **odk-make** and **odk_make**.

## Tool and Arguments

| Argument       | Type   | Required | Description |
|----------------|--------|----------|-------------|
| **robot_args** | string | yes      | The full ROBOT subcommand and options. Paths relative to the mounted project root (e.g. `ontology/edit.owl`). |
| **project_dir** | string | no       | Optional. When working on a **cloned** or project dir under `projects/<slug>/`, set to that root (e.g. `projects/pizza`, `projects/owner-repo`) so the correct project is mounted. Relative paths resolved from repo root. Omit or leave empty for the workspace ontology. |

## Examples (calling the tool)

- Verify (workspace): **odk_robot** with `robot_args`: `verify --input ontology/edit.owl --output report.txt`
- Validate profile (clone): **odk_robot** with `robot_args`: `validate-profile --input ontology/edit.owl --profile DL`, `project_dir`: `projects/owner-repo`
- Reason: **odk_robot** with `robot_args`: `reason --input ontology/edit.owl --reasoner elk --output reasoned.owl`
- Merge: **odk_robot** with `robot_args`: `merge --inputs ontology/a.owl ontology/b.owl --output merged.owl`
- Convert: **odk_robot** with `robot_args`: `convert --input ontology/edit.owl --output edit.obo --format obo`
- Template: **odk_robot** with `robot_args`: `template --template templates/terms.yaml --input terms.csv --output terms.owl`
- Query: **odk_robot** with `robot_args`: `query --input ontology/edit.owl --query query.rq results.csv`
- Version: **odk_robot** with `robot_args`: `--version`

## Tool Requirement

This skill requires: **odk_robot**

After learning this skill, call `setup_tools(skills: ["odk-robot"])` to activate the tool, then use `call_tool(name: "odk_robot", data: {"robot_args": "..."})` to invoke it.
