#!/usr/bin/env node

const TypedError        = require("error/typed");
const inquirer          = require('inquirer');
const mustache          = require('mustache');
const fs                = require('fs-jetpack');
const chalk             = require('chalk');
const nodeFlag          = require('node-flag')
const log               = console.log;

// The problem isn't with the program, it's something else
// Ref - https://www.joyent.com/node-js/production/design/errors
const OperationalError = TypedError({
    type: 'operational',
    message: "{title}",
    title: null,
    origError: null // optional
});

const index = async (flags) => {

// Input/output
const srcVariablePath = flags.srcVariablePath || './src/variables.json';
const srcTemplatePath = flags.srcTemplatePath || './src/templates';
const dstPath = flags.dstPath || './dst';

// Templating config override
// Mustache's default {{}} may be iffy for Terraform code
mustache.tags = [ '<%', '%>' ];


log(chalk.gray(`You'll answer some questions, then we'll copy '${srcTemplatePath}' to '${dstPath}' and embed your answers!`));

// Reality check
if (fs.exists(dstPath)) {
    const override = (await inquirer.prompt([{type: 'confirm', name: 'value', message: `'${dstPath}' directory already exists should we override it?`}])).value;
    if (override) {
        fs.remove(dstPath);
        log(chalk.gray(`* Removing '${dstPath}' *`));
    } else {
        log(chalk.red(`Remove '${dstPath}' and retry later!`));
        process.exit(1);
    }
}

// Inquire user
log(chalk.gray("Ok, lets start the questioning!"));
if (!fs.exists(srcVariablePath)) {
    throw new OperationalError({ title: `The '${srcVariablePath}' file doesn't exist`});
}

let variableInfo;
try {
    variableInfo = fs.read(srcVariablePath, 'json');
} catch (error) {
    throw new OperationalError({ title: "The variables.json file couldn't be parsed", origError: error});
}

const variables = await inquirer.prompt(variableInfo.variables);

// Process and generate
log(chalk.gray(`Ok, we have the answers, I'll try to copy '${srcTemplatePath}' to '${dstPath}' and embed your answers now!`));
fs.copy(srcTemplatePath, dstPath); // copy src -> dst

const relativeTemplatePaths = fs.list(dstPath); // find templates
for (let relativeTemplatePath of relativeTemplatePaths) { // for all templates
    let absoluteTemplatePath = `${dstPath}/${relativeTemplatePath}`;
    let template = fs.read(absoluteTemplatePath);
    let renderedTemplate = mustache.render(template, variables); // render template

    fs.write(absoluteTemplatePath, renderedTemplate); // save rendered template
}

log(chalk.gray(`Well, seems like you're good to go, feel free to use '${dstPath}'`));

}

// Call index and calm the user if errors arise
const indexCatchAll = async (flags) => {
    index(flags).catch(async (error) => {
        log(chalk.red("Whoopsie daisy, something went wrong! ¯\\_(ツ)_/¯"));
        if (error.type === OperationalError.type) {
            log(chalk.red("Reason: " + error.message));
        } else {
            log(chalk.red("The reason isn't clear-cut, feel free to read the backtrace."));
        }

        throw error.origError || error;
    });
}

// Compatibility - import or run standalone
module.exports = index;

if (require.main === module) {
    indexCatchAll({
        srcVariablePath: nodeFlag.get('variablesJs'),
        srcTemplatePath: nodeFlag.get('templateDir'),
        dstPath: nodeFlag.get('outputDir')
    });
}

