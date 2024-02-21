export const isUserAuthorized = (req: { headers: { authorization: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; }, next: () => any) => {
    const authorization = req.headers.authorization;
    if (authorization){
        return next();
    }
    return res.status(401).send("Unauthorized");
}