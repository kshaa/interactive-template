const chalk = require('chalk');
const log = console.log;

module.exports = function() {
    log(chalk.dim(`
interactive-template

This tool can be used to:
- Take constants from a json
- Take variable declarations from a json
- Interactively inquire user to provide variable values
- Render a set of templates using constants and variables

In essence this is a wrapper for:
- Mustache.js (templating engine)
- Inquirer.js (questioning library)
- fs-jetpack.js (Filesystem library)
`
    ));

    log(chalk.bold(`
Flags:
// Source of constant data for rendering templates
constants: nodeFlag.get('constants') || nodeFlag.get('constant') || nodeFlag.get('c'),
// Source of interactively generated data for rendering templates
variables: nodeFlag.get('variables') || nodeFlag.get('variable') || nodeFlag.get('v'),
// File or directory of templates
input: nodeFlag.get('input') || nodeFlag.get('i'),
// File or directory of rendered templates
output: nodeFlag.get('output') || nodeFlag.get('o')

`
    ));

    log(chalk.dim(`
This is copy-pasted from code.    
E.g to pass in the \`constants\` option through a flag use \`--constants \`, \`--constant\` or \`-c\`
Constants and variables can be comma-seperated  
    `));
}