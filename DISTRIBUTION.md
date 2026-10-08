# Distribution

This package can be shared as a local path, Git package, or later as an npm package. Do not publish from this repository as part of normal MVP use.

## Local path installation

For personal use:

```bash
pi install /absolute/path/to/pi-engineering-harness
```

For a specific target repository:

```bash
cd /path/to/target-repo
pi install --local /absolute/path/to/pi-engineering-harness
```

Relative local paths resolve from the settings file that contains them. Restart Pi or run `/reload` after installation.

## Git installation and tags

After this package is committed to a Git repository and tagged by maintainers, coworkers can install a pinned tag:

```bash
pi install git:github.com/your-org/pi-engineering-harness@v0.1.0
```

A project can also declare it locally:

```bash
pi install --local git:github.com/your-org/pi-engineering-harness@v0.1.0
```

Git tags or commits are pinned; updating the configured ref requires changing the installed source/ref.

## Optional npm publication later

If maintainers later choose to publish, keep `keywords` including `pi-package`, ensure runtime dependencies are declared correctly, and publish through the team's normal npm process. Consumers would install with:

```bash
pi install npm:pi-engineering-harness@0.1.0
```

This repository intentionally includes no publishing automation.

## Updating installed packages

Use Pi's package update command when appropriate:

```bash
pi update --extensions
```

Review third-party or project package source before trusting it, because Pi packages may include executable extension code.
