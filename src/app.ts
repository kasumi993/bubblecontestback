import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { Survey } from "./entity/Survey";
import { Option } from "./entity/Option";
import { addOptionsToSurvey, getSurveyById, getSurveys } from "./services/Survey";
import { isUserAuthorized } from "./middleware";
import { authenticateUser, createUser } from "./services/User";
import PocketBase from 'pocketbase'

createConnection().then(async connection => {
    const pb = new PocketBase('http://127.0.0.1:8090');
    pb.autoCancellation(false);
    const app = express();
    const port = 3000;

    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.post("/authenticate", async (req, res) => {
        try {
            const user = await authenticateUser({ ...req.body, pb });
            return res.status(200).json(user);
        } catch (err) {
            return res.status(401).send("User not found");
        }
    });

    app.post("/users", async (req, res) => {
        try {
            const user = await createUser({ ...req.body, pb });
            await authenticateUser({ email: req.body.email, password: req.body.password, pb });
            return res.status(201).json(user);
        } catch (err) {
            return res.status(401).send("Unauthorized");
        }
    });

    app.get('/surveys', async (req, res) => {
        const surveys = await getSurveys(connection);
        res.json(surveys);
    });

    app.get('/surveys/:surveyId', async (req, res) => {
        const surveyId = parseInt(req.params.surveyId);

        if (isNaN(surveyId)) {
            return res.status(400).send("L'ID du survey doit être un nombre valide.");
        }
    
        try{
            const survey = await getSurveyById(connection, surveyId);
            res.status(200).json(survey);
        }catch(err){
            const error = err as Error;
            res.status(404).send(error.message);
        }
    });

    app.get('/options', async (req, res) => {
        const option = await connection.manager.find(Option);
        res.status(200).json(option);
    });

    app.post('/surveys', isUserAuthorized, async (req, res) => {
        const survey = await connection.manager.save(Survey, req.body);
        res.status(201).json(survey);
    });

    app.post('/surveys/:surveyId/options', isUserAuthorized, async (req, res) => {
        const surveyId = parseInt(req.params.surveyId);
        if (isNaN(surveyId)) {
            return res.status(400).send("L'ID du survey doit être un nombre.");
        }

        try{
            await addOptionsToSurvey(connection, surveyId, req.body);
            return res.status(201);
        }catch(err){
            const error = err as Error;
            res.status(404).send(error.message);
        }
    });

    app.listen(port, () => {
        console.log(`Serveur lancé sur http://localhost:${port}`);
    });
}).catch(error => console.log(error));
