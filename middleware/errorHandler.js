//JSON Error Handling Middleware

function handleInvalidJson(err,req,res,next){
  if(err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON payload format.',
      details: err.message
    });
  }
  next();
};

module.exports = { handleInvalidJson };