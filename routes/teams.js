const express = require('express');
const {ObjectId} = require('mongodb');
const{getCollection} = require('../config/db');
const router = express.Router();


/*****************************************************************
 * ********************   GET ROUTES   ***************************
******************************************************************/


//Endpoint: Get All contacts, type http://localhost:8080/teams in the url box
/**
 * @openapi
 * /teams:
 *   get:
 *     tags:
 *      - FIFA Teams
 *     summary: Get all teams
 *     description: Retrieve a standard array of all team documents from the database.
 *     responses:
 *       200:
 *         description: A list of contacts.
 *       500:
 *         description: Database error.
 */
router.get('/', async(req,res) => {
    try{
        //for my collection
        const collection = getCollection('fifa_teams');
        //Find all documents and convert them into a stanard JavaScript array
        const allTeams = await collection.find({}).toArray();
        res.json(allTeams);
    }catch(error){
        res.status(500).send("Error pulling data from the database.");
    }
    
});


// Endpoint: GET ONE single team by its unique ID. 
// Type http://localhost:8080/teams/{any id from the database}
/**
 * @openapi
 * /teams/{id}:
 *   get:
 *     tags:
 *      - FIFA Teams
 *     summary: Get a single team by ID
 *     description: Search the database for a matching unique _id record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique MongoDB Object ID
 *     responses:
 *       200:
 *         description: Contact object found.
 *       404:
 *         description: Contact not found.
 *       500:
 *         description: Invalid ID format.
 */
router.get('/:id', async (req, res) => {
    try {
        const collection = getCollection('fifa_teams');
        
        // Convert the text ID string from the URL into a real MongoDB Object ID
        const teamId = new ObjectId(req.params.id);
        
        // Search the database for the matching unique _id record
        const singleTeam = await collection.findOne({ _id: teamId });
        
        if (!singleTeam) {
            return res.status(404).send("Team not found.");
        }
        
        res.json(singleTeam);
    } catch (error) {
        res.status(500).send("Team ID is formatted incorrectly or does not exist.");
    }
});

/**************************************************************************
 * **************************  POST ROUTES*********************************
 * ************************************************************************/
/**
 * @openapi
 * /teams:
 *   post:
 *     tags:
 *      - FIFA Teams
 *     summary: Create a new team
 *     description: Inserts a new document into the MongoDB collection.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_name
 *               - country_code
 *               - confederation
 *               - rank
 *               - stats
 *               - key_players
 *               - active
 *             properties:
 *               team_name:
 *                 type: string
 *                 example: "Egypt"
 *               country_code:
 *                 type: string
 *                 example: "EGY"
 *               confederation:
 *                 type: string
 *                 example: "CAF"
 *               rank:
 *                 type: integer
 *                 example: 24
 *               stats:
 *                 type: object
 *                 required:
 *                  - points
 *                  - previous_rank
 *                 properties:
 *                  points:
 *                      type: number
 *                      example: 1597.04
 *                  previous_rank:
 *                      type: integer
 *                      example: 29
 *               key_players:
 *                 type: array
 *                 items:
 *                  type: string
 *                 example: ["Mohamed Salah", "Omar Marmoush", "Mostafa Mohamed"]
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Team created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Database insertion failed.
 */
router.post('/', async(req,res) => {
    const {team_name, country_code, confederation, rank, stats, key_players, active} = req.body;

    //Validate input
    if(!team_name || !country_code || !confederation || !rank || !stats || !key_players || !active){
        return res.status(400).json({
            error: 'All fields (team_name, country_code, confederation, rank, stats, key_players, active) are required.'
        });
    }

    try {
        //calls the teams collection
        const teamsCollection = getCollection('fifa_teams');
        //Assemble the new document
        const newTeam= { team_name, country_code, confederation, rank, stats, key_players, active};
        //inserts the new document in the MongoDB collection
        const result = await teamsCollection.insertOne(newTeam);
        //returns the id of the new document
        return res.status(201).json({ 
             message: 'A new team record has been created',
             id: newTeam._id
            });
    } catch(error) {
        return res.status(500).json({
            error: 'Database saving failed.',
            details: error.message
        });
    }
});

// /**************************************************************************
//  * **************************  PUT ROUTES*********************************
//  * ************************************************************************/
/**
 * @openapi
 * /teams/{id}:
 *   put:
 *     tags:
 *      - FIFA Teams
 *     summary: Update team record
 *     description: Updates document in the MongoDB collection.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique 24-character MongoDB ObjectId of the book
 *         example: "6a551bc0cd1b72630dbfbf12"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_name
 *               - country_code
 *               - confederation
 *               - rank
 *               - stats
 *               - key_players
 *               - active
 *             properties:
 *               team_name:
 *                 type: string
 *                 example: "Egypt"
 *               country_code:
 *                 type: string
 *                 example: "EGY"
 *               confederation:
 *                 type: string
 *                 example: "CAF"
 *               rank:
 *                 type: integer
 *                 example: 24
 *               stats:
 *                 type: object
 *                 required:
 *                  - points
 *                  - previous_rank
 *                 properties:
 *                  points:
 *                      type: number
 *                      example: 1597.04
 *                  previous_rank:
 *                      type: integer
 *                      example: 29
 *               key_players:
 *                 type: array
 *                 items:
 *                  type: string
 *                 example: ["Mohamed Salah", "Omar Marmoush", "Mostafa Mohamed"]
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Team created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Database insertion failed.
 */
router.put('/:id', async(req,res) => {
    const {id}=req.params;
    const {team_name, country_code, confederation, rank, stats, key_players, active} = req.body;

    //Validate input
    if(!team_name || !country_code || !confederation || !rank || !stats || !key_players || !active){
        return res.status(400).json({
            error: 'All fields (team_name, country_code, confederation, rank, stats, key_players, active) are required.'
        });
    }

    try {
        //calls the teams collection
        const teamsCollection = getCollection('fifa_teams');
        //Assemble the updated fields
        const updateTeam = { team_name, country_code, confederation, rank, stats, key_players, active};
        //updates the document in the MOngoDB collection using its id
        const result = await teamsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: updateTeam}
        );
        //check if document was found
        if(result.matchedCount === 0){
            return res.status(404).json({error: 'Team not found'});
        }
        //returns 204 no content status or 200 sucess message
        return res.status(200).json({ message: 'Team updated successfully.' }); 
    } catch(error) {
        return res.status(500).json({error: 'Database saving failed.', details: error.message})
    }
});

// /**************************************************************************
//  * **************************  DELETE ROUTES*********************************
//  * ************************************************************************/
/**
 * @openapi
 * /teams/{id}:
 *   delete:
 *     tags:
 *      - FIFA Teams
 *     summary: Delete a team from database
 *     description: Deletes a document from the MongoDB collection using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique MongoDB Object ID to delete
 *     responses:
 *       200:
 *         description: Contact deleted successfully.
 *       404:
 *         description: Contact not found.
 *       500:
 *         description: Database deletion failed.
 */
router.delete('/:id', async(req,res) => {
    const {id}=req.params;
    
    try {
        //calls the contacts collection
        const teamsCollection = getCollection('fifa_teams');
        
        //deletes the document in the MOngoDB collection using its id
        const result = await teamsCollection.deleteOne(
            {_id: new ObjectId(id)}
        );
        //check if document was found
        if(result.deletedCount === 0){
            return res.status(404).json({error: 'Contact not found'});
        }
        //returns 200 sucess message
        return res.status(200).json({ message: 'Contact deleted successfully.' }); 
    } catch(error) {
        return res.status(500).json({error: 'Database saving failed.', details: error.message})
    }
});


module.exports = router;