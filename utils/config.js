const DB = {
    URI: 'mongodb://localhost:27017',
    PROD_URI: `mongodb+srv://purvesh123:${process.env.PROD_MONGODB_PASSWORD}@ticket-entry-system.znmqll6.mongodb.net/?retryWrites=true&w=majority`,
    NAME: 'support_ticket_entry_system_db'
}

const SWAGGER_OPTIONS = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Support Ticket Entry System',
            version: '1.0.0',
        },
    },
    apis: ['./controllers/*.js'],
}

module.exports = { DB, SWAGGER_OPTIONS };