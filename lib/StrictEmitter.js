'use strict';

const EventEmitter = require('events');
const createEvent = require('./create-event');

class StrictEmitter extends EventEmitter {
    constructor (options) {
        super();

        options = options || {};
        this.errorEvent = options.errorEvent || 'error';

        if (typeof options.errorFormatter === 'function') {
            this._errorFormatter = options.errorFormatter;
        }
    }

    emit (eventDefinition, ...args) {
        if (typeof eventDefinition === 'string') {
            super.emit(eventDefinition, ...args);
        } else {
            const event = createEvent(eventDefinition, args[0]);

            super.emit(event.name, event.data);
        }
    }

    on (eventDefinition, listener) {
        if (typeof eventDefinition === 'string') {
            super.on(eventDefinition, listener);
        } else {
            super.on(eventDefinition.name, (...args) => {
                const validationErrors = eventDefinition.validate(args[0]);

                if (validationErrors.length > 0) {
                    let error = null;

                    if (this._errorFormatter) {
                        error = this._errorFormatter(validationErrors);
                    } else {
                        error = new Error('Event validation failed.');

                        error.name = 'EventError';
                        error.data = validationErrors;
                    }

                    this.emit(this.errorEvent, error);
                } else {
                    listener(...args);
                }
            });
        }
    }
}

module.exports = StrictEmitter;
