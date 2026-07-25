const express = require('express');
const { ObjectId } = require('mongodb');
const{ getCollection } = require('../config/db');
const { validateBook } = require('../middleware/validateBook');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');
const { bookValidationRules } = require('../middleware/bookValidationRules');
const { validatePayload } = require('../middleware/validate');


/*****************************************************************
 * ********************   GET ROUTES   ***************************
******************************************************************/
//Endpoint: Get all books
router.get('/', async(req,res) => {
    try{
        //for my books collection
        const collection = getCollection('books');
        //Find all documents and convert them into a stanard JavaScript array
        const allbooks = await collection.find({}).toArray();
        res.json(allbooks);
    }catch(error){
        res.status(500).send("Error pulling data from the database.");
    }
    
});


// Endpoint: GET ONE single contact by its unique ID. 
// Type http://localhost:8080/books/{any id from the database}

router.get('/:id', async (req, res) => {
    try {
        const collection = getCollection('books');
        
        // Convert the text ID string from the URL into a real MongoDB Object ID
        const bookId = new ObjectId(req.params.id);
        
        // Search the database for the matching unique _id record
        const singleBook = await collection.findOne({ _id: bookId });
        
        if (!singleBook) {
            return res.status(404).send("Book not found.");
        }
        
        res.json(singleBook);
    } catch (error) {
        res.status(500).send("Book ID is formatted incorrectly or does not exist.");
    }
});

/**************************************************************************
 * **************************  POST ROUTES*********************************
 * ************************************************************************/

//Endpoint: Create a new book
router.post('/',
    requireAuth,
    bookValidationRules,
    validatePayload,
    async(req,res) => {
    
    try {
        //calls the books collection
        const booksCollection = getCollection('books');
        //inserts the new document in the MongoDB collection after validation
        const result = await booksCollection.insertOne(req.body);
        //returns the id of the new document
        return res.status(201).json({ 
            message: 'New book record created.', 
            id: result.insertedId
        });
    } catch(error) {
        return res.status(500).json({
            error: 'Database saving failed.', 
            details: error.message
        });
    }
});

/**************************************************************************
 * **************************  PUT ROUTES*********************************
 * ************************************************************************/

//Endpoint: Update a book record
router.put('/:id', 
    requireAuth,
    bookValidationRules,
    validatePayload,
    async(req,res) => {
    const {id}=req.params;

    if(!ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID format.'});
    }

    try {
        //calls the books collexction
        const booksCollection = getCollection('books');
        
        //updates the document in the MongoDB collection using its id after validation
        const result = await booksCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: req.body}
        );
        //check if document was found
        if(result.matchedCount === 0){
            return res.status(404).json({error: 'Book not found'});
        }
        //returns 204 no content status or 200 sucess message
        return res.status(200).json({ message: 'Record updated successfully.' }); 
    } catch(error) {
        return res.status(500).json({error: 'Database saving failed.', details: error.message})
    }
});

/**************************************************************************
 * **************************  DELETE ROUTES*********************************
 * ************************************************************************/

//Endpoint: Delete a book by ID
router.delete('/:id', requireAuth, async(req,res) => {
    const {id}=req.params;

    if(!ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID format'});
    }
    
    try {
        //calls the books collection
        const booksCollection = getCollection('books');
        
        //deletes the document in the MOngoDB collection using its id
        const result = await booksCollection.deleteOne(
            {_id: new ObjectId(id)}
        );
        //check if document was found
        if(result.deletedCount === 0){
            return res.status(404).json({error: 'Book not found'});
        }
        //returns 200 sucess message
        return res.status(200).json({ message: 'Book deleted successfully.' }); 
    } catch(error) {
        return res.status(500).json({error: 'Database saving failed.', details: error.message})
    }
});


module.exports = router;