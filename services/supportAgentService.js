const Agent = require('../models/supportAgent');
const { STATUS } = require('../utils');
const { agentQueue, ticketQueue } = require('../utils/queue');

const getAllAgents = async () => {
    try {
        console.log('---> STARTED - supportAgentService - getAllAgents');
        return await Agent.find();
    } catch (err) {
        console.error('Some error fetching data:', err);
        throw new Error(err?.message || 'Some error occured.');
    } finally {
        console.log('---> ENDED - supportAgentService - getAllAgents');
    }
};

const createAgent = async (newAgentPayload) => {
    try {
        console.log('---> STARTED - supportAgentService - createAgent');
        const createdAgent = await Agent.create(newAgentPayload);
        const success = await assignAgentToTicket(createdAgent);
        let msg = 'Agent is successfully created. '
        msg += success
            ? 'And ticket is assigned.'
            : 'ticket will get assigned once it is New/created.';
        agentQueue.push(createdAgent);
        return createdAgent;
    } catch (err) {
        console.error('Error inserting agent into db:', err);
        throw new Error(err?.message || 'Some error occured.');
    } finally {
        console.log('---> ENDED - supportAgentService - createAgent');
    }
};

const assignAgentToTicket = async (createdAgent) => {
    let isAgentAssigned = false;
    const N = ticketQueue.length;

    // Looping till N to avoid infite loop if all the tickets are allocated (not New).
    for (let i = 0; i < N; ++i) {
        const ticket = await ticketQueue.shift(); // pop the agent

        // Ticket is not New
        if (ticket.status == STATUS.ASSIGNED || ticket.status == STATUS.RESOLVED) {
            ticketQueue.push(ticket);
        }

        // Ticket is New
        if (ticket.status == STATUS.NEW) {
            // Assign this ticket to the created Agent
            ticket.assignedTo = createdAgent.name;
            ticket.status = STATUS.ASSIGNED;
            isAgentAssigned = true;
            await ticket.save();  // Save the changes in db
            ticketQueue.push(ticket); // Push to the back of ticketQueue.
            break;
        }
    }

    return isAgentAssigned;
}

module.exports = {
    getAllAgents,
    createAgent
};