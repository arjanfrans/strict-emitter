'use strict';

const createEvent = require('./create-event');

function wrappedEmitter (emitter, options) {
    options = options || {};

    let errorFormatter = null;

    if (typeof options.errorFormatter === 'function') {
        errorFormatter = options.errorFormatter;
    }

    const errorEvent = options.errorEvent || 'error';

    function emit (eventDefinition, ...args) {
        if (typeof eventDefinition === 'string') {
            emitter.emit(eventDefinition, ...args);
        } else {
            const event = createEvent(eventDefinition, args[0]);

            emitter.emit(event.name, event.data);
        }
    }

    function on (eventDefinition, listener) {
        if (typeof eventDefinition === 'string') {
            emitter.on(eventDefinition, listener);
        } else {
            emitter.on(eventDefinition.name, (...args) => {
                const validationErrors = eventDefinition.validate(args[0]);

                if (validationErrors.length > 0) {
                    let error = null;

                    if (errorFormatter) {
                        error = errorFormatter(validationErrors);
                    } else {
                        error = new Error('Event validation failed.');

                        error.name = 'EventError';
                        error.data = validationErrors;
                    }

                    emitter.emit(errorEvent, error);
                } else {
                    listener(...args);
                }
            });
        }
    }

    return {
        emitter,
        emit,
        on
    };
}

module.exports = wrappedEmitter;
