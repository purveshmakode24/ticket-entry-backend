const Agent = require('../models/supportAgent');
const Ticket = require('../models/supportTicket');
const { STATUS } = require('../utils');
const AgentService = require('./supportAgentService');

const getTickets = async ({ status, assignedTo, severity, type, sortBy, sortOrder, page, pageSize }) => {
    try {
        console.log('---> STARTED - supportTicketService - getTickets');
        const filters = {};
        const sorts = {};
        // Skip previous pages, means (p - 1) pages from the beginning.
        const skip = (page - 1) * pageSize  // Would be total no.of records on those pages that need to be skipped.
        if (status) {
            filters['status'] = status;
        }
        if (assignedTo) {
            filters['assignedTo'];
        }
        if (severity) {
            filters['severity'];
        }
        if (type) {
            filters['type'] = type;
        }
        if (sortBy) {
            sorts['sortBy'] = sortBy;
        }
        if (sortOrder) {
            sorts['sortOrder'] = sortOrder;
        }
        return await Ticket.find(filters).sort(sorts).skip(skip).limit(pageSize);
    } catch (err) {
        console.error('Some error fetching data:', err);
        throw new Error(err?.message || 'Some error occured.');
    } finally {
        console.log('---> ENDED - supportTicketService - getTickets');
    }
};

const createTicket = async (newTicketPayload) => {
    try {
        console.log('---> STARTED - supportTicketService - createTicket');
        const createdTicket = await Ticket.create(newTicketPayload);
        const success = await assignTicketToAgent(createdTicket);
        let message = 'Ticket successfully is created. '
        if (!success) {
            console.log('Ticket is created, but no active agents available to assign ticket right now.');
            message += 'but no active agents available to assign ticket right now.';
        }
        return [createdTicket, message];
    } catch (err) {
        console.error('Error inserting data into db:', err);
        throw new Error(err?.message || 'Some error occured.');
    } finally {
        console.log('---> ENDED - supportAgentService - createTicket');
    }
};

const assignTicketToAgent = async (createdTicket) => {
    const agents = await AgentService.getAllAgents();
    let activeAgentFound = false;
    for (let agent of agents) {
        if (agent.active) {
            activeAgentFound = true;
            createdTicket.assignedTo = agent.name;
            createdTicket.status = STATUS.ASSIGNED;
            await createdTicket.save();
            agent.active = false;
            await agent.save();
            break;
        }
    }

    return activeAgentFound;
}

const resolveTicket = async (ticketId) => {
    try {
        const ticketToResolve = await Ticket.findById(ticketId);
        // Resolve the ticket.
        ticketToResolve.status = STATUS.RESOLVED;
        ticketToResolve.resolvedOn = Date.now();

        ticketToResolve.save();


        // Potential unassigned agent.
        const agent = await Agent.findOne({ 'name': ticketToResolve.assignedTo });

        // First check if there are any unassigned new tickets available in db, 
        // if there is, then add the above agent to first unallocated ticket from db.
        let unallocatedTicketFound = false;
        const tickets = await Ticket.find();
        for (let ticket of tickets) {
            if (ticket.assignedTo == null) {
                unallocatedTicketFound = true;
                // Assign this agent to this ticket
                ticket.assignedTo = agent.name;
                ticket.status = STATUS.ASSIGNED;
                ticket.save();
                break;
            }
        }

        if (!unallocatedTicketFound) {
            // Make this agent active, if there are no unallocated ticket. 
            // (means all tickets in db are already allocated to the agents)
            agent.active = true;
            await agent.save();
        }

        return { 'resolvedOn': ticketToResolve.resolvedOn }

    } catch (err) {
        console.error('Error while resolving ticket:', err);
        throw new Error(err || 'Some error occured.');
    }
}

module.exports = {
    getTickets,
    createTicket,
    resolveTicket
};