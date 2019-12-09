

function post_in_bound(req, res, next) {
    if (req.body.text.length > 140 || req.body.text.length == 0)
    {
        res.status(400);
        res.end();
        return;            
    }
    next();
}


module.exports = { post_in_bound };