const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const booksRoute = require('./routes/books');
const teamsRoute = require('./routes/teams');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


/*****************************************************************************************
 * *******************************Swagger Configuration***********************************
 ****************************************************************************************/

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'Interactive API documentation for managing contacts',
    },
     
    tags: [
      {
        name: 'Books',
        description: 'Operations and endpoints related to managing the book inventory'
      },
      {
        name: 'FIFA Teams',
        description: 'Operations and endpoints related to managing top national football teams'
      }
    ],
    servers: [
      {
        url: '/', // It forces Swagger to dynamically use whatever domain the app is currently running on
        description: 'Current enviroment',
      },
    ],
  },
  apis: ['./routes/*.js'], // Points to the routes folder. Adjust if your folder setup is different!
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/books', booksRoute);
app.use('/teams', teamsRoute);
//Start Server
async function startServer() {
    try {
        await connectDB();//wait for db to connect sucessfully
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Failed to connect to the database");
    }
};


startServer();