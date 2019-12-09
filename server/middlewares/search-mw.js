function fix_search(req, res, next) {
    if(req.query.keyword.length > 3){
        next();
        return;
    }
    res.status(403);
    res.end();
}


module.exports = { fix_search}