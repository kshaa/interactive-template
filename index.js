#!/usr/bin/env node

/**
 * Library or binary entry-point
 */

// Libraries
const interactiveTemplateLib = require('./lib/InteractiveTemplate');
const interactiveTemplateBin = require('./bin/interactiveTemplate');

// Export library
module.exports.InteractiveTemplate = interactiveTemplateLib;

// Trigger binary
if (require.main === module) {
    interactiveTemplateBin();
}
