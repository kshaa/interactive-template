#!/usr/bin/env node

const InteractiveTemplate = require('../lib/InteractiveTemplate');
const OperationalError = require('../lib/OperationalError');
const printHelp = require('../lib/printHelp');
const nodeFlag = require('node-flag');
const chalk = require('chalk');
const log = console.log;

(async () => {
    // Read flags
    let flags = {
        constants: nodeFlag.get('constants') || nodeFlag.get('constant') || nodeFlag.get('c'),
        variables: nodeFlag.get('variables') || nodeFlag.get('variable') || nodeFlag.get('v'),
        input: nodeFlag.get('input') || nodeFlag.get('i'),
        output: nodeFlag.get('output') || nodeFlag.get('o')
    };

    for (flagEntry of Object.entries(flags)) {
        if (flagEntry[1] === null) delete flags[flagEntry[0]];
    }

    const helpRequired = nodeFlag.isset('help') || nodeFlag.isset('h');
    if (helpRequired) {
        printHelp();

        return;
    }

    if (Object.entries(flags).length === 0)
        log(chalk.dim("FYI, for help add '-h' flag"));

    // Trigger template process
    log(chalk.gray(`Let's compile some information & try to render templates!`));
    const templateInstance = new InteractiveTemplate(flags);

    log(chalk.gray("Checking some flags..."));
    templateInstance.initialize();

    log(chalk.gray("Compiling information..."));
    await templateInstance.compile();

    log(chalk.gray("Rendering remplates..."));
    templateInstance.render();
})().catch(async (error) => {
    // Catch errors and print pretty
    log(chalk.red("Whoopsie daisy, something went wrong! ¯\\_(ツ)_/¯"));
    if (error.type === OperationalError.type) {
        log(chalk.red("Reason: " + error.message));
    } else {
        log(chalk.red("The reason isn't clear-cut, feel free to read the backtrace."));
    }

    throw error.origError || error;
});
