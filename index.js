#!/usr/bin/env node
/**
 * Library entry-point
 */
const interactiveTemplateLib = require('./lib/InteractiveTemplate');
const operationalErrorLib = require('./lib/OperationalError');

module.exports = {
    InteractiveTemplate: interactiveTemplateLib,
    OperationalError: operationalErrorLib
};
