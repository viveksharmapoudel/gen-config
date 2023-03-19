import * as fs from 'fs';
export function readJsonFile(filename) {
    try {
        const jsonString = fs.readFileSync(filename);
        const op = JSON.parse(String(jsonString));
        return op;
    }
    catch (err) {
        console.log(err);
    }
}
export function writeToFile(obj, filename) {
    try {
        if (typeof filename !== 'string') {
            throw Error('Filename should be in string ');
        }
        const jsonString = JSON.stringify(obj);
        fs.writeFile(filename, jsonString, err => {
            if (err) {
                console.log('Error writing file', err);
            }
            else {
                console.log('Successfully wrote file');
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=utils.js.map