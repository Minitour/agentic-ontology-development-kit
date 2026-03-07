---
name: odk-make
description: Run standard ODK Make targets in an existing ODK project. Use whenever the user wants test/QC results, release artefacts (merged ontology, OBO, subsets), refreshed imports, updated ODK Makefile/templates, or the ODK version—e.g. "run tests", "prepare release", "refresh imports", "what ODK version". Use this skill for test, prepare_release, refresh-imports, update_repo, odkversion; use odk-run for custom Make targets.
---

# ODK Make Skill

Use this skill when the user needs **concrete outcomes** from an **existing ODK project**: **test/QC results**, **release artefacts** (merged ontology, OBO, subsets), **updated import modules**, **updated ODK repo files** (Makefile, templates), or the **ODK version**. The repository must already be an ODK project (e.g. created with **odk_seed** or a clone under `projects/`). **Use the odk_make tool** (activate the skill with setup_tools, then call_tool)—do not run `make` via shell.

**Project directory and Make path**:
- **Workspace ontology** (no clone): Omit or leave **`project_dir`** empty. Set **`make_path`** to where the Makefile lives relative to the mounted root (e.g. `src/ontology`).
- **Cloned project** under `projects/<slug>/`: Set **`project_dir`** to the clone root (e.g. `projects/owner-repo`). Set **`make_path`** to the path to the Makefile directory inside that clone: many ODK repos use **`src/ontology`**; some use **`src/<id>`** (e.g. `src/envo`). Check the clone’s layout (e.g. `src/ontology/Makefile` vs `src/envo/Makefile`) and pass the correct **make_path**. **Always use the built-in odk_make tool with project_dir and make_path** for clones—do not run the Docker script manually.

## When to Use This Skill (by outcome)

- User wants **QC / test results** (report, validate-profile, rule checks) → use **odk_make** with `target`: `test`; output is test report and pass/fail.
- User wants **release artefacts** (merged ontology, OBO, subsets as defined by the Makefile) → use **odk_make** with `target`: `prepare_release`; output is files in the release directories.
- User wants **updated import modules** (all or one) → use **odk_make** with `target`: `refresh-imports` or `refresh-<name>` (e.g. `refresh-go`); output is updated import OWL files.
- User wants **imports updated but skip large ones** → use **odk_make** with `target`: `refresh-imports-excluding-large` when the project defines it.
- User wants **ODK Makefile and generated files updated** to a newer ODK version → use **odk_make** with `target`: `update_repo`; output is updated files under `src/ontology/`.
- User wants to **see which ODK version the repo uses** → use **odk_make** with `target`: `odkversion`; output is version string.
- User wants **documentation updated** (when the project uses ODK-driven docs) → use **odk_make** with `target`: `update_docs` if defined.
- User wants **another standard Make target** (e.g. `all`, `clean`, or a project-specific target) → use **odk_make** with that `target`. For non-standard or one-off targets, use **odk_run** with `make -C src/ontology <target>`.

## What Each Target Does and How to Use It

### test

**What it does**: Runs the ontology test suite (e.g. ROBOT report, validate-profile, verify, other QC steps defined in the Makefile). **Output**: Test report and exit success/failure.

**How it works**: `odk_make` with `target`: `test`.

**Example**: **odk_make** with `target`: `test`

---

### prepare_release

**What it does**: Builds release artefacts (merged ontology, OBO, subsets, etc.) as defined by the project’s Makefile. **Output**: Release files (e.g. in `src/ontology/` or a release directory).

**How it works**: `odk_make` with `target`: `prepare_release`.

**Example**: **odk_make** with `target**: `prepare_release`

---

### refresh-imports

**What it does**: Updates all import modules (pulled/generated from upstream or mirrors). **Output**: Updated import OWL files (e.g. under `src/ontology/imports/`).

**How it works**: `odk_make` with `target`: `refresh-imports`.

**Example**: **odk_make** with `target`: `refresh-imports`

---

### refresh-<import_name>

**What it does**: Updates a single import module (e.g. go, ro, bfo). **Output**: Updated OWL file for that import.

**How it works**: `odk_make` with `target`: `refresh-go` (or the import name the project uses).

**Example**: **odk_make** with `target**: `refresh-go`

---

### refresh-imports-excluding-large

**What it does**: Same as refresh-imports but skips imports the project marks as “large”. **Output**: Updated import files for non-large imports.

**How it works**: `odk_make` with `target`: `refresh-imports-excluding-large` (if the Makefile defines it).

**Example**: **odk_make** with `target`: `refresh-imports-excluding-large`

---

### update_repo

**What it does**: Updates the Makefile and ODK-generated files to the latest ODK version. **Output**: Updated files under `src/ontology/` (and possibly CI).

**How it works**: `odk_make` with `target`: `update_repo`.

**Example**: **odk_make** with `target`: `update_repo`

---

### odkversion

**What it does**: Prints the ODK version that the repo’s Makefile is configured to use. **Output**: Version string (e.g. `v1.2.3`).

**How it works**: `odk_make` with `target`: `odkversion`.

**Example**: **odk_make** with `target`: `odkversion`

---

### update_docs

**What it does**: Rebuilds or updates ODK-driven documentation (e.g. MkDocs). **Output**: Updated docs (if the project defines this target).

**How it works**: `odk_make` with `target`: `update_docs`.

**Example**: **odk_make** with `target`: `update_docs`

---

## When Not to Use This Skill

- **Creating a new ODK repo** from a config YAML → use **odk-seed** and **odk_seed**.
- **Single ROBOT/owltools/dosdp-tools commands** (not via Make) → use **odk-robot** or **odk-run**.
- **Custom or one-off Make targets** not in the list above → use **odk-run** with `command`: `make -C src/ontology <target>`.

## Tool and Arguments

| Argument       | Type   | Required | Description |
|----------------|--------|----------|-------------|
| **target**     | string | yes      | The Make target. Common: `test`, `prepare_release`, `refresh-imports`, `refresh-imports-excluding-large`, `refresh-<name>`, `update_repo`, `odkversion`, `update_docs`. Use the exact target name the project’s Makefile defines. |
| **project_dir** | string | no       | Optional. When working on a **cloned** ontology under `projects/<slug>/`, set to the clone root (e.g. `projects/owner-repo`). Omit or leave empty for the workspace ontology. |
| **make_path**  | string | no       | Path to the Makefile directory relative to the project root. Use **`src/ontology`** for standard ODK layout, or **`src/<id>`** when the repo uses a named subdir (e.g. `src/envo`). Pass this explicitly when using **project_dir** so the correct Makefile is used. |

## Examples (calling the tool)

- **odk_make** with `target`: `test`, `make_path`: `src/ontology`
- **odk_make** with `target`: `prepare_release`, `make_path`: `src/ontology`
- **odk_make** with `target`: `refresh-imports`, `make_path`: `src/ontology`
- **odk_make** with `target**: `test`, `project_dir`: `projects/owner-repo`, `make_path`: `src/envo` (for a clone that uses `src/envo/Makefile`)
- **odk_make** with `target`: `validate-dl-profile`, `project_dir`: `projects/owner-repo`, `make_path`: `src/envo` (project-specific target)

## Tool Requirement

This skill requires: **odk_make**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
