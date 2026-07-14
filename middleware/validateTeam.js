const validateTeam = (req, res, next) => {
    const {
        team_name,
        country_code,
        confederation,
        rank,stats,
        key_players,
        active
    } = req.body;

    //Validate input
    // if(!team_name || !country_code || !confederation || !rank || !stats || !key_players || !active){
    //     return res.status(400).json({
    //         error: 'All fields (team_name, country_code, confederation, rank, stats, key_players, active) are required.'
    //     });
    // }

    //Validate data types and constraints
    if (typeof team_name !== 'string' || team_name === '') {
        return res.status(400).json({error: 'Team name must be a non-empty string.'});
    }
    if (typeof country_code !== 'string' || country_code === '') {
        return res.status(400).json({error: 'Country code must be a non-empty string.'});
    }
    if (typeof confederation !== 'string' || confederation === ''){
        return res.status(400).json({error: 'Confederation must be a non-empty string.'});
    }
    if (!Number.isInteger(rank) || rank <= 0) {
        return res.status(400).json({error: 'Rank must be an integer number greater than 0.'});
    }
    if (typeof stats !== 'object' || stats === null || Array.isArray(stats)) {
        return res.status(400).json({error: 'Stats must be a valid object. Check Swagger configuration.'});
    }
    if (typeof stats.points !== 'number' || stats.points < 0) {
        return res.status(400).json({error: 'Points must be a valid number equal or greater than 0.'});
    }
    if (!Number.isInteger(stats.previous_rank) || stats.previous_rank <= 0){
        return res.status(400).json({error: 'Previous rank must be an integer number greater than 0.'});
    }
    if (!Array.isArray(key_players) ||
        key_players.length === 0 ||
        !key_players.every(p => 
            typeof p === 'string' &&
            p.trim() !== ''))
    {
        return res.status(400).json({error: 'Key players must be an array of non-empty strings.'});
    }
    if (typeof active !== 'boolean'){
        return res.status(400).json({error: 'Active must be a valid boolean value (true or false).'});
    }

    req.body.team_name = team_name.trim();
    req.body.country_code = country_code.trim();
    req.body.confederation = confederation.trim();
    req.body.key_players = key_players.map(p => p.trim());

    delete req.body._id;
    next();

};

module.exports = {
    validateTeam
}