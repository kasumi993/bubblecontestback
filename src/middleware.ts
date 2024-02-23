import { NextFunction, Request, Response } from "express";
const PocketBase = require('pocketbase/cjs');
import { jwtDecode } from "jwt-decode";
import { getUserById } from "./services/User";
const pb = new PocketBase("http://127.0.0.1:8090")

export const canUserRead = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.autorization as string;
    const decoded = token && token!=="null" ? jwtDecode(token) as any : null; 

    const userToken = pb.authStore.baseToken;
    const model = pb.authStore.baseModel;
    try{
        if (userToken && model) {
            if (model.canRead) {
                return next();
            } else {
                return res.status(403).json("You are not allowed to read");
            }
        } else if (decoded) {
            const user = await getUserById(decoded.id)
            if (user.canRead) {
                return next();
            } else {
                return res.status(403).json("You are not allowed to read");
            }
        } else {
            return res.status(400).json("You are not connected");
        }
    } catch (err: any) {
        if(err.status === 404){
            return res.status(404).json("User not found");
        }
        return res.status(400).json("An error occured");
    }
}

export const canUserEdit = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.autorization as string;
    const decoded = jwtDecode(token) as any; 

    const userToken = pb.authStore.baseToken;
    const model = pb.authStore.baseModel;
    try{
        if (userToken && model) {
            if (model.canEdit) {
                return next();
            } else {
                return res.status(403).json("You are not allowed to edit");
            }
        } else if (decoded) {
            const user = await getUserById(decoded.id)
            if (user.canEdit) {
                return next();
            } else {
                return res.status(403).json("You are not allowed to edit");
            }
        } else {
            return res.status(400).json("You are not connected");
        }
    } catch (err: any) {
        if(err.status === 404){
            return res.status(404).json("User not found");
        }
        return res.status(400).json("An error occured");
    }
}

export const isUserPremium = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.autorization as string;
    const decoded = jwtDecode(token) as any; 

    const userToken = pb.authStore.baseToken;
    const model = pb.authStore.baseModel;
    try{
        if (userToken && model) {
            if (model.isPremium) {
                return next();
            } else {
                return res.status(403).json("You are not premium");
            }
        } else if (decoded) {
            const user = await getUserById(decoded.id)
            if (user.isPremium) {
                return next();
            } else {
                return res.status(403).json("You are not premium");
            }
        } else {
            return res.status(400).json("You are not connected");
        }
    } catch (err: any) {
        if(err.status === 404){
            return res.status(404).json("User not found");
        }
        return res.status(400).json("An error occured");
    }
}

export const isAdministrator = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.autorization as string;
    const decoded = jwtDecode(token) as any; 

    const userToken = pb.authStore.baseToken;
    const model = pb.authStore.baseModel;
    try{
        if (userToken && model) {
            if (model.canEdit && model.canRead) {
                return next();
            } else {
                return res.status(403).json("You are not admin");
            }
        } else if (decoded) {
            const user = await getUserById(decoded.id)
            if (user.canEdit && user.canRead) {
                return next();
            } else {
                return res.status(403).json("You are not admin");
            }
        } else {
            return res.status(400).json("You are not connected");
        }
    } catch (err: any) {
        if(err.status === 404){
            return res.status(404).json("User not found");
        }
        return res.status(400).json("An error occured");
    }
}