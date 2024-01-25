const Ticket = require('../models/supportTicket');
const { STATUS } = require('../utils');
const { ticketQueue, agentQueue } = require('../utils/queue');

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
        let msg = 'Ticket successfully is created. '
        msg += success
            ? 'And Agent is assigend.'
            : 'Agent will get assigned once available';

        ticketQueue.push(createdTicket);
        return [createdTicket, msg];
    } catch (err) {
        console.error('Error inserting data into db:', err);
        throw new Error(err?.message || 'Some error occured.');
    } finally {
        console.log('---> ENDED - supportAgentService - createTicket');
    }
};

const assignTicketToAgent = async (createdTicket) => {
    let isAgentAssigned = false;
    const N = agentQueue.length;

    // Looping till N to avoid infite loop if all the agents are inactive.
    for (let i = 0; i < N; ++i) {
        const agent = await agentQueue.shift(); // pop the agent from left

        // Agent not active
        if (!agent.active) {
            agentQueue.push(agent);
        }
        
        // Agent active
        if (agent.active) {
            // Assign this agent to the ticket
            createdTicket.assignedTo = agent.name;
            createdTicket.status = STATUS.ASSIGNED;
            isAgentAssigned = true;
            await createdTicket.save();  // Save the changes in db
            agentQueue.push(agent); // Push to the back of agentQueue.
            break;
        }
    }

    return isAgentAssigned;
}

module.exports = {
    getTickets,
    createTicket
};