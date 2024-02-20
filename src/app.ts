import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { Survey } from "./entity/Survey";
import { Option } from "./entity/Option";

createConnection().then(async connection => {
    const app = express();
    const port = 3000;

    app.use(express.json());

    app.get('/surveys', async (req, res) => {
        const surveys = await connection.manager.find(Survey);
        res.json(surveys);
    });

    app.get('/surveys/:surveyId', async (req, res) => {
        const surveyId = parseInt(req.params.surveyId);
        if (isNaN(surveyId)) {
            return res.status(400).send("L'ID du survey doit être un nombre valide.");
        }
    
        const survey = await connection.manager.findOne(Survey, {
            where: { survey_id: surveyId }, 
            relations: ["options"], 
        });
        
        if (!survey) {
            return res.status(404).send("Survey non trouvé.");
        }
    
        res.json(survey);
    });
    
    

    app.get('/options', async (req, res) => {
        const option = await connection.manager.find(Option);
        res.json(option);
    });

    app.post('/surveys', async (req, res) => {
        const survey = await connection.manager.save(Survey, req.body);
        res.status(201).json(survey);
    });

    app.post('/surveys/:surveyId/options', async (req, res) => {
        const surveyId = parseInt(req.params.surveyId);
        if (isNaN(surveyId)) {
            return res.status(400).send("L'ID du survey doit être un nombre.");
        }
    
        const survey = await connection.manager.findOne(Survey, { where: { survey_id: surveyId } });
        if (!survey) {
            return res.status(404).send("Survey non trouvé.");
        }
    
        const optionData = req.body; 
        const option = new Option();
        option.name = optionData.name;
        option.choices = optionData.choices;
        option.survey = survey;
        option.survey_id = survey.survey_id; 
        
    
        await connection.manager.save(option);
    
        return res.status(201).json(option);
    });

    app.listen(port, () => {
        console.log(`Serveur lancé sur http://localhost:${port}`);
    });
}).catch(error => console.log(error));
