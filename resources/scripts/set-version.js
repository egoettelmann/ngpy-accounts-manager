const writeFileSync = require('fs').writeFileSync;
const execSync = require('child_process').execSync;

/**
 * Gets the current version number.
 *
 * @returns {string} the current version number
 */
function getVersionNumber() {
    let sourceVersion = process.env.SOURCE_VERSION;
    if (!sourceVersion) {
        try {
            sourceVersion = execSync('git rev-parse HEAD', { encoding: 'utf8' });
        } catch (err) {
            console.error(err);
            return '0.0.1';
        }
    }
    const shortHash = sourceVersion.substr(0, 7);
    const todayDate = getCurrentDate();
    return todayDate + '.' + shortHash;
}

/**
 * Gets the current date in the following format: yyyy-mm-dd
 *
 * @returns {string}
 */
function getCurrentDate() {
    return new Date().toISOString().slice(0,10);
}

/**
 * Writes a given content to a file.
 *
 * @param filePath the path of the file to write to
 * @param content the content
 */
function writeToFile(filePath, content) {
    try {
        writeFileSync(filePath, content, 'utf8');
    } catch (err) {
        console.error(err);
    }
}


/**
 * Writes the version number to a dedicated file
 */
writeToFile('./version.txt', getVersionNumber());
