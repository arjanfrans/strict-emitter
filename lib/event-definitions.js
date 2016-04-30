'use strict';

const Ajv = require('ajv');
const ajv = Ajv();

function ajvError (errors) {
    const err = new Error('Error validation failed.');

    err.message = ajv.errorsText(errors, {
        separator: '\n  - ',
        dataVar: 'data'
    });

    return err;
}

function createSchemaValidators (definitions) {
    const validators = {};

    for (const eventName of Object.keys(definitions)) {
        const definition = definitions[eventName];

        const schema = {
            type: 'object',
            properties: definitions.data || {},
        };

        if (definition.required) {
            schema.required = definition.required;
        }

        const validate = ajv.compile(schema);

        validators[eventName] = function (data) {
            const isValid = validate(data || {});

            if (isValid) {
                return true;
            }

            throw ajvError(validate.errors);
        };
    }

    return validators;
}

function createSimpleValidators (definitions) {
    const validators = {};

    for (const eventName of Object.keys(definitions)) {
        const definition = definitions[eventName];

        validators[eventName] = function (data) {
            const errors = [];

            if (definition.required) {
                for (const key of definition.required) {
                    const value = key.split('.').reduce((obj, index) => {
                        if (obj) {
                            return obj[index];
                        }

                        return null;
                    }, data);

                    if (value === null) {
                        errors.push({
                            property: key,
                            keyword: 'required'
                        });
                    }
                }
            }

            return errors;
        };
    }

    return validators;
}

function createDefinitions (definitions, options) {
    options = options || {};

    const eventDefinitions = {};
    let validators = null;

    if (options.schema) {
        validators = createSchemaValidators(definitions);
    } else {
        validators = createSimpleValidators(definitions);
    }

    const validateTrue = () => true;

    for (const eventName of Object.keys(definitions)) {
        const definition = definitions[eventName];

        eventDefinitions[eventName] = Object.assign({
            name: eventName
        }, definition);

        if (validators && validators[eventName]) {
            eventDefinitions[eventName].validate = validators[eventName];
        } else {
            eventDefinitions[eventName].validate = validateTrue;
        }
    }

    return eventDefinitions;
}

module.exports = createDefinitions;
