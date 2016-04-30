'use strict';

const createEventDefinitions = require('./event-definitions');
const createEvent = require('./create-event');
const StrictEmitter = require('./StrictEmitter');
const wrappedEmitter = require('./wrapped-emitter');

module.exports = {
    createEventDefinitions,
    createEvent,
    StrictEmitter,
    wrappedEmitter
};
