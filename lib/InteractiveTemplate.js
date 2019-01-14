const OperationalError = require('./OperationalError');
const FileHelper = require('./FileHelper');
const fileHelper = new FileHelper();
const extend = require('extend');
const inquirer = require('inquirer');
const mustache = require('mustache');

const InteractiveTemplate = function(options) {
    this.options = extend({
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
    }, options);

    // Constants and variables get compiled into locals and used in template rendering
    this.locals = {};

    // Data
    this.getValidConstantPaths = function() {
        let paths;
        if (typeof this.options.constants === "string")
            paths = this.options.constants.split(',');
        else
            paths = this.options.constants;

        return fileHelper.filterValidPaths(paths);
    }

    this.getConstants = function() {
        const paths = this.getValidConstantPaths();
        const allConstants = {};

        for (path of paths) {
            let constants = fileHelper.core.read(path, 'json');
            extend(allConstants, constants);
        }

        return allConstants;
    }

    this.getValidVariablePaths = function() {
        let paths;
        if (typeof this.options.variables === "string")
            paths = this.options.variables.split(',');
        else
            paths = this.options.variables;

        return fileHelper.filterValidPaths(paths);
    }

    this.getVariables = function() {
        const paths = this.getValidVariablePaths();
        let allVariables = [];

        for (path of paths) {
            let variableJson = fileHelper.core.read(path, 'json');
            let variables = variableJson.variables;

            allVariables = allVariables.concat(variables);
        }

        return allVariables;
    }

    // Validation
    this.validateInput = function() {
        const inputType = fileHelper.core.exists(this.options.input);

        return inputType === "file" || inputType === "dir";
    }

    this.validateConstants = function() {
        return this.getValidConstantPaths().length > 0;
    }

    this.validateVariables = function() {
        return this.getValidVariablePaths().length > 0;
    }

    this.validateOptions = function() {
        if (!this.validateInput())
            throw new OperationalError({ title: "No templates/inputs found"});

        if (!this.validateConstants() && !this.validateVariables())
            throw new OperationalError({ title: "No valid constants or variables found"});

        return this;
    }

    // Runtime
    this.setDefaultTemplateTags = function() {
        mustache.tags = this.options.templateTags;

        return this;
    }

    this.initialize = function() {
        this.validateOptions();
        this.setDefaultTemplateTags();

        return this;
    }

    this.compileConstants = function() {
        let constants = this.getConstants();

        extend(this.locals, constants);

        return this;
    }

    this.compileVariables = async function() {
        let variables = this.getVariables();
        let compiledVariables = await inquirer.prompt(variables);

        extend(this.locals, compiledVariables);

        return this;
    }

    this.compile = async function() {
        this.compileConstants();
        await this.compileVariables();

        return this;
    }

    this.cleanOutput = function() {
        if (fileHelper.core.exists(this.options.output))
            fileHelper.core.remove(this.options.output);

        return this;
    }

    this.renderFile = function(inputPath, outputPath, locals) {
        let template = fileHelper.core.read(inputPath);
        let renderedTemplate = mustache.render(template, locals);

        fileHelper.core.write(outputPath, renderedTemplate);

        return this;
    }

    this.render = function() {
        const locals = this.locals;
        const input = this.options.input;
        const output = this.options.output;

        this.cleanOutput();

        if (fileHelper.core.exists(input) === "file") {
            // Read input file, render to output file
            this.renderFile(input, output, locals);
        } else if (fileHelper.core.exists(input) === "dir") {
            // Copy input directory to output path
            fileHelper.core.copy(input, output);

            // Recursively map over all files
            // Read a template and write straight to it
            fileHelper.recursivelyMapDirectoryFiles(output, function(templatePath) {
                this.renderFile(templatePath, templatePath, locals);
            }.bind(this));
        }

        return this;
    }
};

module.exports = InteractiveTemplate;