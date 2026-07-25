const express = require('express');
const {ObjectId} = require('mongodb');
const{getCollection} = require('../config/db');
const {validateTeam} = require('../middleware/validateTeam');
const router = express.Router();
const {requireAuth} = require('../middleware/requireAuth');
const { teamValidationRules } = require('../middleware/teamValidationRules');
const { validatePayload } = require('../middleware/validate');


/*****************************************************************
 * ********************   GET ROUTES   ***************************
******************************************************************/


//Endpoint: Get All contacts, type http://localhost:8080/teams in the url box
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

//Endpoint: Create a new team record
router.post('/',
    requireAuth,
    teamValidationRules,
    validatePayload,
    async(req,res) => {
    
    try {
        //calls the teams collection
        const teamsCollection = getCollection('fifa_teams');
        // //Assemble the new document
        // const newTeam= { team_name, country_code, confederation, rank, stats, key_players, active};
        //inserts the new document in the MongoDB collection
        const result = await teamsCollection.insertOne(req.body);
        //returns the id of the new document
        return res.status(201).json({ 
             message: 'A new team record has been created',
             id: result.insertedId
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

//Endpoint: Update a team record by ID
router.put('/:id',
    requireAuth,
    teamValidationRules,
    validatePayload,
    async(req,res) => {
    const {id} = req.params;
    
    if(!ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID format'})
    }
    
    try {
        //calls the teams collection
        const teamsCollection = getCollection('fifa_teams');
        //updates the document in the MOngoDB collection using its id after validation
        const result = await teamsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: req.body}
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

//Endpoint: Delete a record by ID
router.delete('/:id', requireAuth, async(req,res) => {
    const {id}=req.params;
    
    if(!ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID format'});
    }

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