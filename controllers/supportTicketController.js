const express = require('express');
const api = express.Router();
const { getTickets, createTicket, resolveTicket } = require('../services/supportTicketService');
const { HTTP_STATUS } = require('../utils');

/**
 * @openapi
 * tags:
 *   name: SupportTicket
 *   description: SupportTicket APIs
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         topic:
 *           type: string
 *         description:
 *           type: string
 *         dateCreated:
 *           type: number
 *         severity:
 *           type: string
 *         type:
 *           type: string
 *         assignedTo:
 *           type: string
 *         status:
 *           type: string
 *         resolvedOn:
 *           type: string
 *     TicketPost:
 *       type: object
 *       properties:
 *         topic:
 *           type: string
 *         description:
 *           type: string
 *         severity:
 *           type: string
 *         type:
 *           type: string
 */


/**
 * @openapi
 * /api/support-tickets:
 *   get:
 *     description: GET support tickets.
 *     tags: [SupportTicket]
 *     parameters:
 *       - in: query
 *         name: status
 *         description: Filter by Status
 *         schema:
 *           type: string
 *           enum:
 *            - New
 *            - Assigned
 *            - Resolved
 *       - in: query
 *         name: assignedTo
 *         description: Filter by assignedTo
 *         schema:
 *           type: string
 *       - in: query
 *         name: severity
 *         description: Filter by Severity
 *         schema:
 *           type: string
 *           enum:
 *            - Low
 *            - Medium
 *            - High
 *       - in: query
 *         name: type
 *         description: Filter by Type
 *         schema:
 *           type: string
 *           enum:
 *            - Hardware Issue
 *            - Software Issue
 *       - in: query
 *         name: sortBy
 *         description: Sorting
 *         schema:
 *           type: string
 *           enum:
 *            - resolvedOn
 *            - dateCreated
 *       - in: query
 *         name: sortOrder
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum:
 *            - asc
 *            - desc
 *       - in: query
 *         name: page
 *         description: Page no. for pagination
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         description: Records per page for pagination
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Returns support tickets.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 */
api.get('/', async (req, res) => {
    try {
        console.log('---> STARTED - Support Ticket GET Controller');
        const tickets = await getTickets(req.query);
        res.status(HTTP_STATUS.OK).json(tickets);
    } catch (err) {
        console.error('Somer Error Occured:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
    } finally {
        console.log('---> ENDED - Support Ticket GET Controller');
    }
});


/**
 * @openapi
 * /api/support-tickets:
 *   post:
 *     description: POST support tickets. Create a ticket and assign this ticket to the next active agent.
 *     tags: [SupportTicket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketPost'
 *     responses:
 *       201:
 *         description: Creates support ticket.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *         
 */
api.post('/', async (req, res) => {
    try {
        console.log('---> STARTED - Support Ticket POST Controller');
        const newTicketPayload = req.body;
        const ct = await createTicket(newTicketPayload);
        res.status(HTTP_STATUS.CREATED).json({ data: ct[0], message: ct[1] });
    } catch (err) {
        console.error('Some Error Occured:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
    } finally {
        console.log('---> ENDED - Support Ticket POST Controller');
    }
});


/**
 * @openapi
 * /api/support-tickets/resolve/{ticketId}:
 *   put:
 *     description: Resolve the ticket and make the assigned Agent active.
 *     tags: [SupportTicket]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         description: ID of the ticket to be resolved.
 *         required: true
 *     responses:
 *       200:
 *         description: Resolves the ticket.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *         
 */
api.put('/resolve/:ticketId', async (req, res) => {
    try {
        console.log('---> STARTED - Support Ticket PUT Controller');
        const { ticketId } = req.params;
        const resp = await resolveTicket(ticketId);
        res.status(HTTP_STATUS.OK).json({ 'message': "Ticket Successfully Resolved!", 'resolvedOn': resp.resolvedOn });
    } catch (err) {
        console.error('Some Error Occured:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
    } finally {
        console.log('---> ENDED - Support Ticket PUT Controller');
    }
});


module.exports = api;