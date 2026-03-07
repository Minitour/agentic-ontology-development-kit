---
name: clone-project
description: Clone an ontology repository into the workspace's projects directory for local contribution. Use whenever the user wants to clone an ontology repo, set up a project locally, or get a copy to work on—e.g. "clone this ontology", "set up this repo locally", "get a copy of this project to work on". All subsequent work (edits, branch, PR) is done from the cloned project directory.
---

# Clone Project Skill

Use this skill when the user wants to **clone an ontology repository** so they can work on it in this workspace. Clones go into a single, predictable location: **`projects/<slug>/`** at the root of the Ontology Builder repo. All later steps (implement, ODK/ROBOT, branch, commit, PR) are performed **from that project directory**—the agent (or user) changes directory into the clone and runs everything there.

## When to Use

- User says **"clone this ontology"**, **"set up this repo locally"**, **"get a copy of this project to work on"**, or provides a repo URL to clone.
- As the second step in the external-contribution workflow (after **analyze-project**, or in parallel): clone into `projects/`, then the user or agent will cd into the clone for implement and PR.

Use this skill so clones land in one place and paths stay consistent; do not clone into arbitrary directories.

## Workflow

1. **Resolve repo URL**: From the user's message or a prior analyze step, get the clone URL (e.g. `https://github.com/owner/repo` or `git@github.com:owner/repo.git`) and derive a **stable slug** (e.g. `owner-repo`) so the same repo always lands in the same path.
2. **Ensure `projects/` exists**: At the root of the Ontology Builder repo, create the directory `projects/` if it does not exist. The `projects/` directory is gitignored.
3. **Clone**: Run `git clone <url> projects/<slug>`. Use the slug consistently (e.g. from GitHub: `owner-repo`). If `projects/<slug>` already exists, do not overwrite—report that the project is already cloned and where it is; offer to pull latest or to use the existing clone.
4. **Verify build (optional but recommended)**: Use the **built-in ODK tools** with **project_dir** set to the clone path. For example: **odk_make** with `target`: `test`, `project_dir`: `projects/<slug>`, and `make_path`: the path to the Makefile in the clone (e.g. `src/ontology` or `src/envo`). Do not run `node scripts/odk-docker-run.js` manually—use **odk_robot** and **odk_make** with **project_dir** so the correct project is mounted. Report success or any failure.
5. **Tell the user**: Confirm the clone path (`projects/<slug>/`). For ODK/ROBOT and Make, use **odk_robot** and **odk_make** with **project_dir** set to `projects/<slug>` (and **make_path** when using odk_make). Git operations (branch, commit, PR) are still done from the clone directory (cd into it).

## Slug Convention

- Prefer a slug that is stable and readable: e.g. from `https://github.com/org/ontology-name` use `ontology-name`. Avoid spaces and characters that are problematic in paths.
- The same repo URL should always map to the same slug so repeated clones or "open this project" workflows find the same folder.

## Working on the Clone

After cloning:

- **ODK/ROBOT and Make**: Use the **built-in odk_robot and odk_make tools** with **project_dir** set to the clone root (e.g. `projects/owner-repo`). Paths in `robot_args` are relative to the clone root (e.g. `src/envo/envo-edit.owl`). For **odk_make**, also set **make_path** to where the Makefile lives (e.g. `src/ontology` or `src/envo`). Do not run `node scripts/odk-docker-run.js` from the shell—using the tools with **project_dir** ensures the correct project is mounted and keeps the workflow consistent.
- **Ontology-editor**: Use absolute paths to OWL files in the clone (e.g. `C:\...\ontology-builder\projects\owner-repo\src\envo\envo-edit.owl`) or load the file and register it by name.
- **Git operations** (branch, commit, push, PR): Perform these from the clone root (cd into `projects/<slug>/`). The **create-pull-request** skill assumes the agent is in that directory for Git commands.

## Prerequisites

- Git installed; network access to the clone URL.
- For running ODK/QC after clone: Docker (and optionally Make) as required by the target project; the Ontology Builder script uses the ODK Docker image and mounts the clone's `src/` when run from the clone root.

## Output

- Report the clone path: `projects/<slug>/`.
- If build/QC was run, report pass/fail.
- Remind that subsequent steps (implement, branch, PR) are done from that directory.
