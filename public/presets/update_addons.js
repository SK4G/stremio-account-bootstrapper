import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToUpdate = ['en.json', 'es.json', 'pt.json', 'factory.json'].map(file => path.join(__dirname, file));

async function checkAndUpdateAddons(filePath) {
    console.log(chalk.yellow(`Updating file: ${filePath}`));

    let addonsData;
    let upToDate = true;

    try {
        addonsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error(chalk.red(`Failed to parse JSON file ${filePath}:`, error.message));
        return;
    }

    const addons = addonsData.result.addons;

    for (let addon of addons) {
        try {
            const response = await axios.get(addon.transportUrl);
            const remoteManifest = response.data;

            if (remoteManifest.version && remoteManifest.version !== addon.manifest.version) {
                console.log(chalk.green(`Updating ${addon.manifest.name} from version ${addon.manifest.version} to ${remoteManifest.version}`));
                addon.manifest = remoteManifest;
                upToDate = false;
            } else {
                console.log(chalk.blue(`${addon.manifest.name}`) + " is up to date in " + chalk.yellow(`${path.basename(filePath)}`));
            }
        } catch (error) {
            if (error.message.includes('connect ECONNREFUSED 127.0.0.1:11470')) {
                // Ignore error from stremio local files
                continue;
            }
            console.error(chalk.red(`Failed to fetch manifest for ${addon.manifest.name}:`, error.message));
        }
    }

    if (!upToDate) {
        const date = new Date().toLocaleDateString('en-CA').replace(/-/g, '.');
        const backupFilePath = path.join(__dirname, `${path.basename(filePath, '.json')}-${date}.json`);
        
        fs.writeFileSync(backupFilePath, JSON.stringify(addonsData, null, 2));
        console.log('Addons updated successfully. Backup saved as ' + chalk.green(`${path.basename(filePath, '.json')}-${date}.json`));
    }
}

filesToUpdate.forEach(filePath => {
    checkAndUpdateAddons(filePath);
});