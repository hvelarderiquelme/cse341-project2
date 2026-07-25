//Solves DNS issues
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

//Libraries needed
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');

//Modular settings
const { initAuth } = require('./middleware/auth-setup');
const { setupSwagger } = require('./config/swagger');
const { connectDB } = require('./config/db');

//Error handling middleware
const { handleInvalidJson} = require('./middleware/errorHandler');

//Routes objects
const authroute = require('./routes/auth');
const booksRoute = require('./routes/books');
const teamsRoute = require('./routes/teams');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

//Apply JSON error handling middleware
app.use(handleInvalidJson);

//Initializa authentication modules (session + passport)
initAuth(app);

//Initialize documentation modules
setupSwagger(app);

//Application endpoint mappings
app.use('/auth', authroute);//connects /auth/github, /auth/github/callback, etc
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