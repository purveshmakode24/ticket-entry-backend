const express = require('express');
const mongoose = require('mongoose');
const swagger = require('swagger-ui-express');
const swaggerJSdoc = require('swagger-jsdoc');
const path = require('path');
const supportAgentRoutes = require('./controllers/supportAgentController');
const supportTicketRoutes = require('./controllers/supportTicketController');
const { SWAGGER_OPTIONS, DB } = require('./utils/config');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

const router = express.Router();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


const isDebug = process.env.DEBUG === 'true';
const mongoURI = isDebug ? `${DB.URI}/${DB.NAME}` : process.env.PROD_MONGODB_URI;

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
    res.redirect('/api-docs');
});

const swaggerSpec = swaggerJSdoc(SWAGGER_OPTIONS);
app.use('/api-docs', express.static('node_modules/swagger-ui-dist/', { index: false }), swagger.serve, swagger.setup(swaggerSpec));
app.use('/api/support-agents', supportAgentRoutes);
app.use('/api/support-tickets', supportTicketRoutes);

module.exports = app;