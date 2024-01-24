const express = require('express');
const mongoose = require('mongoose');
const swagger = require('swagger-ui-express');
const swaggerJSdoc = require('swagger-jsdoc');
const supportAgentRoutes = require('./controllers/supportAgentController');
const supportTicketRoutes = require('./controllers/supportTicketController');
const { SWAGGER_OPTIONS, DB } = require('./utils/config');
const cors = require('cors');
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const isDebug = process.env.DEBUG === 'true';
const mongoURI = isDebug ? `${DB.URI}/${DB.NAME}` : process.env.MONGODB_PROD_URI;

// Mongoose/MongoDB Connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the app server once the mongo connection is establised.
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('Error connecting to MongoDB', err));

// Routes
app.get('/', (req, res) => {
    res.redirect('/docs');
});

const swaggerSpec = swaggerJSdoc(SWAGGER_OPTIONS);
app.use('/docs', swagger.serve, swagger.setup(swaggerSpec));
app.use('/api/support-agents', supportAgentRoutes);
app.use('/api/support-tickets', supportTicketRoutes);

module.exports = app;