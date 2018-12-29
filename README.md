# Interactive template
I just wanted to automate hardcoding variables into a boilerplate template, this script helps me do it.

# Why?
I keep copy-pasting a directory, parsing through its files and modifying some hardcoded values.
I want to make this process prettier for myself.

So now this hardcoding is done using a template engine (Mustache.js) and an interactive questioner (Inquirer.js).

# Flags
- variablesJs \(def: "./src/variables.json"\) - Where the variables and their descriptions will be taken from
- templateDir \(def: "./src/templates"\) - Where the templates to be rendered will be taken from  
- outputDir \(def: "./dst"\) - Where to put the rendered templates


# Usage
Typical usage supposing a default file structure
```
* Some templates exist in './src/template' *
* Some variables from './src/variables.json will be hardcoded in templates *
  
npm -g git+https://git@github.com/kshaa/interactive-template.git
interactive-template
  
* Fill out questions about variables *
* Your answers (variables) get hardcoded in templates *
* Rendered templates get stored in './dst' *
```

Custom file structure
```
interactive-template --variablesJs "./src/variables.json" --templateDir "./src/templates" --outputDir "./dst"
```

See `/examples` folder to see the results of the above ^

# Notes
- Nothing is guaranteed  
- This code might catch fire
    
    
- Nested template folder structure isn't supported  
- Constants aren't supported  
- Single file templating isn't supported  
  
  
- A better version of this has probably already been coded by someone else  
- Mustache.js's interpolation notation {{}} has been replaced with <%%>
- If an error appears and it's stack seems cropped, run node w/ `--stack-trace-limit=1000`  