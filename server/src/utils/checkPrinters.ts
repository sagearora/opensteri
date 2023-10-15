import { exec } from 'child_process';

function checkPrinters() {
    // Using lpstat -a to list all connected printers
    exec('lpstat -a', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }

        if (stdout) {
            console.log('Printers found:');
            console.log(stdout);
        } else {
            console.log('No printers found.');
        }
    });
}

export default checkPrinters;