---
name: odk-seed
description: Create or regenerate a full ODK ontology repo from a config YAML. Use whenever the user wants a new OBO or BFO-aligned ontology project, an ODK scaffold, bootstrap from YAML, or to migrate/refresh an existing OBO repo—e.g. "scaffold an OBO ontology", "set up ODK for my ontology", "generate the ODK structure". Output is src/ontology, Makefile, CI, imports. Do not use for non-OBO or non-BFO ontologies.
---

# ODK Seed Skill

Use this skill when the user needs to create or (re)generate an ODK-managed ontology that is **OBO** (OBO format / OBO Foundry style) or **uses BFO** (Basic Formal Ontology) as its upper-level ontology. You get a full project layout in one step. For other kinds of ontologies (e.g. non-OBO, different upper ontologies), use other project setup or tooling instead.

When the scope matches, you get a **full project layout**: `src/ontology/` (Makefile, edit file, imports), CI config (e.g. GitHub Actions), documentation scaffold, and ODK templates. You need an ODK **config YAML** in `src/`. **Use the minimal config template below** — no need to look up the ODK project schema for basic BFO-aligned setup.

## When to Use This Skill (by outcome)

- User wants to **start a new ontology project** that is **OBO or BFO-aligned** and have a standard ODK repo (Makefile, CI, imports, release workflow) → run **odk_seed** with a new or existing config YAML; output is the full directory structure and files.
- User wants to **migrate an existing OBO or BFO-aligned ontology repo to ODK** → create or adapt a `*-odk.yaml` for that ontology, then run **odk_seed**; output is ODK files (you may need to reconcile with existing files via `git mv` or manual edits).
- User wants to **refresh or update ODK-generated files** (e.g. after an ODK upgrade or config change) for an OBO/BFO ontology → run **odk_seed** again with the same config; follow ODK docs for when re-seeding is appropriate.

## What the Tool Does and How It Works

**What it does**: Runs the ODK seed command (`odk seed -c -C <config_path>`). It reads the config YAML and generates (or updates) the ODK project layout: `src/ontology/` (Makefile, edit file, catalog, imports setup), CI workflow files, documentation config, and other ODK boilerplate. Optional **extra** arguments (e.g. `--commit-artefacts`) can be passed to control whether release artefacts are committed by default.

**How it works**:
- **config_path**: In this repo, the seed runs inside a container whose working directory is `src/`. Always pass the **filename only** (e.g. `pizza-odk.yaml`), not `src/pizza-odk.yaml` — the container has no `src/` subdirectory. Place the config file at `src/<filename>` on the host.
- **extra**: Optional string of extra CLI arguments (e.g. `--commit-artefacts`). Git identity is supplied by default in this repo.

**Output**: ODK writes to `target/<id>/` (e.g. `target/example/`). In the Ontology Builder repo, a script runs after seed and copies `target/<id>/src` into `src/` (ontology, sparql, metadata, scripts→odk-scripts), so the ontology layout ends up at `src/ontology/`, `src/sparql/`, etc.

## When Not to Use This Skill

- **Ontology is not OBO and does not use BFO** (e.g. different upper ontology, non–OBO Foundry project) → do not use ODK seed; use other setup or tooling for that ontology style.
- **Running ROBOT** (verify, merge, convert, etc.) → use **odk-robot** and **odk_robot**.
- **Running Make targets** (test, prepare_release, refresh-imports) in an existing ODK repo → use **odk-make** and **odk_make**.
- **Running owltools, dosdp-tools, or other non-robot tools** → use **odk-run** and **odk_run**.

## Tool and Arguments

| Argument       | Type   | Required | Description |
|----------------|--------|----------|-------------|
| **config_path** | string | yes      | **Filename only** (e.g. `pizza-odk.yaml`). Config must be at `src/<filename>`. Do not pass `src/` prefix — container cwd is `src/`. |
| **extra**       | string | no       | Optional extra arguments (e.g. `--commit-artefacts`). Git identity is provided by default in this repo. |

## Minimal ODK config (BFO-aligned) — no schema lookup needed

Use this template for a BFO-aligned ontology. Create the file at `src/<id>-odk.yaml` (e.g. `src/pizza-odk.yaml`).

```yaml
id: <id>           # lowercase, e.g. pizza
title: <Title>     # Human-readable title
description: <optional short description>
license: https://creativecommons.org/licenses/by/4.0/
import_group:
  products:
    - id: bfo
```

- **Required**: `id` (lowercase), `title`. Optional: `description`, `license`.
- **BFO import**: `import_group.products: [bfo]` gives a single BFO import; ODK will create `src/ontology/imports/bfo_import.owl` and the edit file will use it. No need to look up how ODK specifies BFO — this is the correct form.
- For more imports (e.g. RO, GO), add more entries under `products` or see ODK docs. Do not search the ODK project schema for basic BFO setup; this template is sufficient.

## Ontology Builder repo (Docker wrapper mounts only `src/`)

1. **Config placement**: Create the ODK config at **`src/<id>-odk.yaml`** (e.g. `src/pizza-odk.yaml`). Use the minimal config template above.

2. **Call the tool**: Pass **`config_path` = filename only** (e.g. `pizza-odk.yaml`). Do not pass `src/pizza-odk.yaml` — the seed runs inside a container where the working directory is `/work` (= `src/`), so the path must be the filename relative to `src/`. The wrapper script resolves the path on the host; the container only sees the filename.

3. **After seed**: The copy script puts the ontology at `src/ontology/`, edit file `src/ontology/<id>-edit.owl`. Use **odk_make** (or `make -C ontology <target>`) for `test`, `prepare_release`, `refresh-imports`, etc.

## Examples (calling the tool)

- Ontology Builder (config in `src/`): **odk_seed** with `config_path`: `example-odk.yaml`, `extra`: (empty or `--commit-artefacts`)
- With extra args: **odk_seed** with `config_path`: `myont-odk.yaml`, `extra`: `--commit-artefacts`

## Tool Requirement

This skill requires: **odk_seed**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
