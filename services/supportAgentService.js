const Agent = require('../models/supportAgent');


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
        return await Agent.create(newAgentPayload);;
    } catch (err) {
        console.error('Error inserting agent into db:', err);
        throw new Error(err?.message || 'Some error occured.');
    } finally {
        console.log('---> ENDED - supportAgentService - createAgent');
    }
};

module.exports = {
    getAllAgents,
    createAgent
};