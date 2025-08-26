# How to use the addons update script

This script automatically checks for updates for the addons listed in the preset files and updates them if a new version is available.

## Prerequisites

- Node.js installed on your system.
- The following files must be present:
    - `preset.json` in the `public` directory.
    - `en.json`, `es.json`, `pt.json`, `factory.json` in the `public/presets` directory.

## How to run the script

1.  Open a terminal or command prompt.
2.  Navigate to the `public/presets` directory.
3.  Run the script using the following command:
    ```sh
    node update_addons.js
    ```

## What the script does

- It reads each of the specified JSON files.
- For each addon in the file, it fetches the manifest from its `transportUrl`.
- It compares the version of the remote manifest with the local one.
- If a new version is available, it updates the local addon's manifest with the new one.
- If any addon is updated in a file, it creates a backup of the original file with the current date (e.g., `en-2025.08.25.json`) and updates the original file.