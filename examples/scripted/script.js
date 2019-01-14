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
})().catch(async (error) => {
    if (error.type === interactiveTemplate.OperationalError.type)
        console.log("Reason: " + error.message);
    else
        console.log("The reason isn't clear-cut, feel free to read the backtrace.");

    throw error.origError || error;
});
