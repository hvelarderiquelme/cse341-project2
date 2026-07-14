const validateBook = (req, res, next) => {
    const { 
        title, 
        author, 
        published_year, 
        genres, 
        isbn, 
        stock
    } = req.body;


//Validate input is present
    // if(!title || !author || !published_year || !genres || !isbn || !stock){
    //     return res.status(400).json({
    //         error: 'All fields (title, author, published_year, genres, isbn, stock) are required.'
    //     });
    // }
    //Validate data types and constraints
    if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title must be a non-empty string.'});
    }
    if (typeof author !== 'string' || author.trim() === '') {
        return res.status(400).json({error: 'Author must be a non-empty string.'});
    }
    if (!Number.isInteger(published_year) || 
        published_year < 0 || 
        published_year > new Date().getFullYear()) 
    {
        return res.status(400).json({error: `Publish year must be a 4 digit valid year. No greater than ${new Date().getFullYear()}.`}) 
    }
    if (!Array.isArray(genres) || 
        genres.length === 0 || 
        !genres.every(g => 
            typeof g === 'string' &&
            g.trim() !== ''))
    {
        return res.status(400).json({error: 'Genres must be an array of non-empty strings.'});    
    }
    if (typeof isbn !== 'string' || isbn.trim() === ''){
        return res.status(400).json({error: 'ISBN number must be a non-empty string.'});
    }
    if (typeof stock !== 'object' || stock === null || Array.isArray(stock)) {
        return res.status(400).json({error: 'Stock must be a valid object. Check swagger configuration.'});
    }
    if(!Number.isInteger(stock.available) || stock.available < 0) {
        return res.status(400).json({error: 'Stock available must be a number greater or equal to 0.'});
    }
    if(typeof stock.location !== 'string' || stock.location === '') {
        return res.status(400).json({error: 'Location must be a non-empty string.'});
    }

    req.body.title = title.trim();
    req.body.author = author.trim();
    req.body.genres = genres.map(g => g.trim());
    req.body.isbn = isbn.trim();
    req.body.stock.location = stock.location.trim();
    
    delete req.body._id;
    next();
}

module.exports = {
    validateBook
};