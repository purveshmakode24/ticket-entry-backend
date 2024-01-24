const mongoose = require('mongoose');
const { SEVERITY, TYPES, STATUS } = require('../utils');

const ticketSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    severity: {
        type: String,
        enum: [SEVERITY.LOW, SEVERITY.MEDIUM, SEVERITY.HIGH],
        required: true
    },
    type: {
        type: String,
        enum: [TYPES.HARDWARE_ISSUE, TYPES.SOFTWARE_ISSUE],
        required: true
    },
    assignedTo: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: STATUS.NEW
    },
    resolvedOn: {
        type: Date,
        default: null
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;