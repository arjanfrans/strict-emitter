'use strict';

function createEvent (definition, data) {
    if (typeof definition.validate === 'function') {
        definition.validate(data);
    }

    let message = data.message || null;

    if (!message && definition.message) {
        if (typeof definition.message === 'function') {
            message = definition.message(data);
        } else {
            message = definition.message;
        }
    }

    const event = {
        name: definition.name,
        data: Object.assign({}, data, { message })
    };

    return event;
}

module.exports = createEvent;
