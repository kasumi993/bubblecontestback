import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { Survey } from "./entity/Survey";
import { Option } from "./entity/Option";
import { addOptionsToSurvey, getSurveyById, getSurveys } from "./services/Survey";
import { canUserEdit, canUserRead } from "./middleware";
import { authenticateUser, createUser } from "./services/User";
const cors = require('cors');

createConnection().then(async connection => {
    const app = express();
    const port = 3000;

    app.use(cors())

    app.use(express.json());

    app.get('/', (req, res) => {
        return res.send('Hello World!');
    });

    app.post("/authenticate", async (req, res) => {
        try {
            const user = await authenticateUser({ ...req.body });
            return res.status(200).json(user);
        } catch (err) {
            return res.status(401).send("User not found");
        }
    });

    app.post("/users", async (req, res) => {
        try {
            const user = await createUser({ ...req.body });
            await authenticateUser({ email: req.body.email, password: req.body.password });
            return res.status(201).json(user);
        } catch (err) {
            return res.status(400).send("Unauthorized");
        }
    });

    app.get('/surveys', canUserRead, async (req, res) => {
        try{
            const surveys = await getSurveys(connection);
            return res.status(200).json(surveys);
        }catch(err){
            const error = err as Error;
            return res.status(404).send(error.message);
        }
    });

    app.get('/surveys/:surveyId', canUserRead, async (req, res) => {
        const surveyId = parseInt(req.params.surveyId);

        if (isNaN(surveyId)) {
            return res.status(400).send("L'ID du survey doit être un nombre valide.");
        }
    
        try{
            const survey = await getSurveyById(connection, surveyId);
            return res.status(200).json(survey);
        }catch(err){
            const error = err as Error;
            return res.status(404).send(error.message);
        }
    });

    app.get('/options', canUserRead, async (req, res) => {
        const option = await connection.manager.find(Option);
        return res.status(200).json(option);
    });

    app.post('/surveys', canUserEdit, async (req, res) => {
        const survey = await connection.manager.save(Survey, req.body);
        return res.status(201).json(survey);
    });

    app.post('/surveys/:surveyId/options', canUserEdit, async (req, res) => {
        const surveyId = parseInt(req.params.surveyId);
        if (isNaN(surveyId)) {
            return res.status(400).send("L'ID du survey doit être un nombre.");
        }

        try{
            await addOptionsToSurvey(connection, surveyId, req.body);
            return res.status(201);
        }catch(err){
            const error = err as Error;
            return res.status(404).send(error.message);
        }
    });

    app.put("/options", canUserRead, async (req, res) => {
        try{
            const { options } = req.body;
            await Promise.all(options.map(async (option: any) => {
                const optionToUpdate = await connection.manager.findOne(Option, option.id);

                if (!optionToUpdate) {
                    throw new Error("Option not found");
                }

                optionToUpdate.choices = option.choose;
                await connection.manager.save(optionToUpdate);
            }));
        }catch(err: any){
            return res.status(400).send("An error occured: "+ err.message);
        }
    });

    app.listen(port, () => {
        console.log(`Serveur lancé sur http://localhost:${port}`);
    });
}).catch(error => console.log(error));
