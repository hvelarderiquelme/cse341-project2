const express = require('express');
const {ObjectId} = require('mongodb');
const{getCollection} = require('../config/db');
const router = express.Router();


/*****************************************************************
 * ********************   GET ROUTES   ***************************
******************************************************************/

//Endpoint: Get All books, type http://localhost:8080/books in the url box
/**
 * @openapi
 * /books:
 *   get:
 *     tags:
 *      - Books
 *     summary: Get all books
 *     description: Retrieve a standard array of all book documents from the database.
 *     responses:
 *       200:
 *         description: A list of contacts.
 *       500:
 *         description: Database error.
 */
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


// // Endpoint: GET ONE single contact by its unique ID. 
// // Type http://localhost:8080/books/{any id from the database}
/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags:
 *      - Books
 *     summary: Get a single book by ID
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
        const collection = getCollection('books');
        
        // Convert the text ID string from the URL into a real MongoDB Object ID
        const bookId = new ObjectId(req.params.id);
        
        // Search the database for the matching unique _id record
        const singleBook = await collection.findOne({ _id: bookId });
        
        if (!singleBook) {
            return res.status(404).send("Contact not found.");
        }
        
        res.json(singleBook);
    } catch (error) {
        res.status(500).send("Book ID is formatted incorrectly or does not exist.");
    }
});

/**************************************************************************
 * **************************  POST ROUTES*********************************
 * ************************************************************************/
/**
 * @openapi
 * /books:
 *   post:
 *     tags:
 *      - Books
 *     summary: Create a new book
 *     description: Inserts a new document into the MongoDB collection.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - title
 *              - author
 *              - published_year
 *              - genres 
 *              - isbn
 *              - stock
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Dune"
 *               author:
 *                 type: string
 *                 example: "Frank Herbert"
 *               published_year:
 *                 type: integer
 *                 example: 1965
 *               genres:
 *                 type: array
 *                 items:
 *                  type: string
 *                 example: ["Sci-Fi", "Adventure", "Epic"]
 *               isbn:
 *                 type: string
 *                 example: "9780441172719"
 *               stock:
 *                 type: object
 *                 required:
 *                  - available
 *                  - location
 *                 properties:
 *                  available:
 *                      type: integer
 *                      example: 14
 *                  location:
 *                      type: string
 *                      example: "Aisle 5"
 *     responses:
 *       201:
 *         description: Contact created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Database insertion failed.
 */
router.post('/', async(req,res) => {
    const { 
        title, 
        author, 
        published_year, 
        genres, 
        isbn, 
        stock
    } = req.body;


    //Validate input
    if(!title || !author || !published_year || !genres || !isbn || !stock){
        return res.status(400).json({
            error: 'All fields (title, author, published_year, genres, isbn, stock) are required.'
        });
    }

    try {
        //calls the books collection
        const booksCollection = getCollection('books');
        //Assemble the new docuiment
        const newBook = { title, author, published_year, genres, isbn, stock};
        //inserts the new document in the MongoDB collection
        const result = await booksCollection.insertOne(newBook);
        //returns the id of the new document
        return res.status(201).json({ 
            message: 'New book record created.', 
            id: newBook._id
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
/**
 * @openapi
 * /books/{id}:
 *   put:
 *     tags:
 *      - Books
 *     summary: Update book record
 *     description: Updates book document in the MongoDB collection.
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
 *              - title
 *              - author
 *              - published_year
 *              - genres 
 *              - isbn
 *              - stock
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Dune"
 *               author:
 *                 type: string
 *                 example: "Frank Herbert"
 *               published_year:
 *                 type: integer
 *                 example: 1965
 *               genres:
 *                 type: array
 *                 items:
 *                  type: string
 *                 example: ["Sci-Fi", "Adventure", "Epic"]
 *               isbn:
 *                 type: string
 *                 example: "9780441172719"
 *               stock:
 *                 type: object
 *                 required:
 *                  - available
 *                  - location
 *                 properties:
 *                  available:
 *                      type: integer
 *                      example: 14
 *                  location:
 *                      type: string
 *                      example: "Aisle 5"
 *     responses:
 *       201:
 *         description: Contact updated successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Database insertion failed.
 */
router.put('/:id', async(req,res) => {
    const {id}=req.params;
    const {
        title, 
        author, 
        published_year, 
        genres, 
        isbn, 
        stock
    } = req.body;

    //Validate input
    if(!title || !author || !published_year || !genres || !isbn || !stock){
        return res.status(400).json({
            error: 'All fields (title, author, published_year, genres, isbn, stock) are required.'
        });
    }

    try {
        //calls the books collexction
        const booksCollection = getCollection('books');
        //Assemble the updated fields
        const updateBook = { 
            title,
            author,
            published_year,
            genres,
            isbn,
            stock
        };
        //updates the document in the MongoDB collection using its id
        const result = await booksCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: updateBook}
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
/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     tags:
 *      - Books
 *     summary: Delete a book from database
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
        //calls the books collection
        const booksCollection = getCollection('books');
        
        //deletes the document in the MOngoDB collection using its id
        const result = await booksCollection.deleteOne(
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