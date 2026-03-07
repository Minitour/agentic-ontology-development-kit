---
name: odk-seed
description: Create or regenerate a full ODK ontology repo from a config YAML. Use whenever the user wants a new OBO or BFO-aligned ontology project, an ODK scaffold, bootstrap from YAML, or to migrate/refresh an existing OBO repo—e.g. "scaffold an OBO ontology", "set up ODK for my ontology", "generate the ODK structure". Output is src/ontology, Makefile, CI, imports. Do not use for non-OBO or non-BFO ontologies.
---

# ODK Seed Skill

Use this skill when the user needs to create or (re)generate an ODK-managed ontology that is **OBO** (OBO format / OBO Foundry style) or **uses BFO** (Basic Formal Ontology) as its upper-level ontology. You get a full project layout in one step. For other kinds of ontologies (e.g. non-OBO, different upper ontologies), use other project setup or tooling instead.

When the scope matches, you get a **full project layout**: `src/ontology/` (Makefile, edit file, imports), CI config (e.g. GitHub Actions), documentation scaffold, and ODK templates. You need an ODK **config YAML** (e.g. `myont-odk.yaml`) that conforms to the [ODK project schema](https://github.com/INCATools/ontology-development-kit/blob/master/docs/project-schema.md). The config path is **relative to the project root**.

## When to Use This Skill (by outcome)

- User wants to **start a new ontology project** that is **OBO or BFO-aligned** and have a standard ODK repo (Makefile, CI, imports, release workflow) → run **odk_seed** with a new or existing config YAML; output is the full directory structure and files.
- User wants to **migrate an existing OBO or BFO-aligned ontology repo to ODK** → create or adapt a `*-odk.yaml` for that ontology, then run **odk_seed**; output is ODK files (you may need to reconcile with existing files via `git mv` or manual edits).
- User wants to **refresh or update ODK-generated files** (e.g. after an ODK upgrade or config change) for an OBO/BFO ontology → run **odk_seed** again with the same config; follow ODK docs for when re-seeding is appropriate.

## What the Tool Does and How It Works

**What it does**: Runs the ODK seed command (`odk seed -c -C <config_path>`). It reads the config YAML and generates (or updates) the ODK project layout: `src/ontology/` (Makefile, edit file, catalog, imports setup), CI workflow files, documentation config, and other ODK boilerplate. Optional **extra** arguments (e.g. `--commit-artefacts`) can be passed to control whether release artefacts are committed by default.

**How it works**:
- **config_path**: Path to the ODK config YAML. Interpretation depends on how the tool is run (see **Ontology Builder repo** below when the ODK Docker wrapper mounts only `src/`).
- **extra**: Optional string of extra CLI arguments (e.g. `--commit-artefacts`). In the Ontology Builder repo, Git identity is supplied by default in the seed command so seed does not fail.

**Output**: ODK writes to `target/<id>/` (e.g. `target/example/`). In the Ontology Builder repo, a script runs after seed and copies `target/<id>/src` into `src/` (ontology, sparql, metadata, scripts→odk-scripts), so the ontology layout ends up at `src/ontology/`, `src/sparql/`, etc.

## When Not to Use This Skill

- **Ontology is not OBO and does not use BFO** (e.g. different upper ontology, non–OBO Foundry project) → do not use ODK seed; use other setup or tooling for that ontology style.
- **Running ROBOT** (verify, merge, convert, etc.) → use **odk-robot** and **odk_robot**.
- **Running Make targets** (test, prepare_release, refresh-imports) in an existing ODK repo → use **odk-make** and **odk_make**.
- **Running owltools, dosdp-tools, or other non-robot tools** → use **odk-run** and **odk_run**.

## Tool and Arguments

| Argument       | Type   | Required | Description |
|----------------|--------|----------|-------------|
| **config_path** | string | yes      | Path to the ODK config YAML (see **Ontology Builder repo** for when the wrapper mounts only `src/`). Must conform to ODK project schema. |
| **extra**       | string | no       | Optional extra arguments (e.g. `--commit-artefacts`). Git identity is provided by default in this repo. |

## Ontology Builder repo (Docker wrapper mounts only `src/`)

When the ODK tool runs via a wrapper that mounts **only** `src/` as `/work` (e.g. `scripts/odk-docker-run.js`), follow this procedure:

1. **Config placement**: Create the ODK config **under `src/`** (e.g. `src/<id>-odk.yaml`). The container only sees `src/`, so a config at project root is not visible. Include at least `id` (lowercase) and `title`; optionally `description`, `license`, `imports`, etc. ([ODK project schema](https://incatools.github.io/ontology-development-kit/project-schema/)).

2. **Call the tool**: Use `config_path` equal to the **filename only** (e.g. `example-odk.yaml`), since the working directory inside the container is `src/`. Git identity is passed by default in this repo (see capabilities); use `extra` only for additional args (e.g. `--commit-artefacts`).

3. **Making**: After the copy script runs, the ontology is at `src/ontology/`. Use `make -C ontology <target>` (e.g. `test`, `prepare_release`) when invoking via the wrapper (with `/work` = `src/`).

Do not build the ontology structure by hand from the ODK schema—the seed tool ensures consistency with ODK and the project schema. When the wrapper mounts only `src/`, place the config under `src/` and pass the filename as `config_path`.

## Examples (calling the tool)

- Ontology Builder (config in `src/`): **odk_seed** with `config_path`: `example-odk.yaml`, `extra`: (empty or `--commit-artefacts`)
- With extra args: **odk_seed** with `config_path`: `myont-odk.yaml`, `extra`: `--commit-artefacts`

## Tool Requirement

This skill requires: **odk_seed**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
