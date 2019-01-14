# Interactive template
I just wanted to automate hardcoding variables into a boilerplate template, this script helps me do it.

This tool can be used to:
- Take constants from a json
- Take variable declarations from a json
- Interactively inquire user to provide variable values
- Render a set of templates using constants and variables

In essence this is a wrapper for:
- Mustache.js (templating engine)
- Inquirer.js (questioning library)
- fs-jetpack.js (Filesystem library)

# Usage
See `/examples` folder for more information.
Also see NPM page - https://www.npmjs.com/package/interactive-template

#### cli (aka binary) mode
Typical usage supposing a default file structure
```
npm install -g git+https://git@github.com/kshaa/interactive-template.git#v3.0.0
# or
npm install -g interactive-template@3.0.0
interactive-template
```

Custom file structure
```
interactive-template -i document.sample.txt -v variables.json -o document.txt
```

#### library (aka require) mode
```
const interactiveTemplate = require('interactive-template');

(async () => {
    const templateInstance = new interactiveTemplate.InteractiveTemplate({
         constants: 'constants.json',
         variables: 'variables.json',
         input: 'input.txt',
         output: 'output.txt'
     });
     
    await templateInstance.initialize();
    await templateInstance.compile();
    await templateInstance.render();
})()
```

# Configuration
#### Flags in cli (aka binary) mode
```
{
    // Source of constant data for rendering templates
    constants: nodeFlag.get('constants') || nodeFlag.get('constant') || nodeFlag.get('c'),
    // Source of interactively generated data for rendering templates
    variables: nodeFlag.get('variables') || nodeFlag.get('variable') || nodeFlag.get('v'),
    // File or directory of templates
    input: nodeFlag.get('input') || nodeFlag.get('i'),
    // File or directory of rendered templates
    output: nodeFlag.get('output') || nodeFlag.get('o')
}
```
This is copy-pasted from code.    
E.g to pass in the `constants` option through a flag use `--constants `, `--constant` or `-c`
Constants and variables can be comma-seperated  

#### Options in library (aka require) mode
```
{
    // Source of constant data for rendering templates
    constants: './constants.json',
    // Source of interactively generated data for rendering templates
    variables: './variables.json',
    // File or directory of templates
    input: './in',
    // File or directory of rendered templates
    output: './out',
    // Symbols used in templates to indicate an evaluation
    templateTags: [ '<%', '%>' ]
}
```
These are the default options, when creating a new InteractiveTemplate, you can pass overridden values.

# Notes
- Reliablity not guaranteed   
  
    
- Mustache.js's interpolation notation {{}} has been replaced with <%%>
- If an error appears and it's stack seems cropped, run node w/ `--stack-trace-limit=1000`  