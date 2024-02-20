export const isUserAuthorized = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization){
        return next();
    }
    return res.status(401).send("Unauthorized");
}