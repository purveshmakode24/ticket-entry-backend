const express = require('express');
const api = express.Router();
const { getAllAgents, createAgent } = require('../services/supportAgentService');
const { HTTP_STATUS } = require('../utils');

/**
 * @openapi
 * tags:
 *   name: SupportAgent
 *   description: SupportAgent APIs
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: number
 *         description:
 *           type: string
 *     AgentPost:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         description:
 *           type: string
 */


/**
 * @openapi
 * /api/support-agents:
 *   get:
 *     description: GET support agents.
 *     tags: [SupportAgent]
 *     responses:
 *       200:
 *         description: Returns support agents.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 */
api.get('/', async (req, res) => {
    try {
        console.log('---> STARTED - Support Agent GET Controller');
        const agents = await getAllAgents();
        res.status(HTTP_STATUS.OK).json(agents);
    } catch (err) {
        console.error('Somer Error Occured:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
    } finally {
        console.log('---> ENDED - Support Agent GET Controller');
    }
});


/**
 * @openapi
 * /api/support-agents:
 *   post:
 *     description: POST support agents.
 *     tags: [SupportAgent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgentPost'
 *     responses:
 *       201:
 *         description: Creates support agent.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *         
 */
api.post('/', async (req, res) => {
    try {
        console.log('---> STARTED - Support Agent POST Controller');
        const newAgent = req.body;
        const result = await createAgent(newAgent);
        res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err) {
        console.error('Some Error Occured:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
    } finally {
        console.log('---> ENDED - Support Agent POST Controller');
    }
});


module.exports = api;