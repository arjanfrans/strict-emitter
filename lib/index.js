'use strict';

const createEventDefinitions = require('./event-definitions');
const createEvent = require('./create-event');
const StrictEmitter = require('./StrictEmitter');

module.exports = {
    createEventDefinitions,
    createEvent,
    StrictEmitter
};
