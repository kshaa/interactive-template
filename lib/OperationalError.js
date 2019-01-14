const TypedError = require("error/typed");

const OperationalError = TypedError({
    type: 'operational',
    message: "{title}",
    title: null,
    origError: null
});

module.exports = OperationalError;