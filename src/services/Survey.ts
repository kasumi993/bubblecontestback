import { Connection, EntityManager } from "typeorm";
import { Survey } from "../entity/Survey";
import { Option } from "../entity/Option";

export const getSurveys = async (connection: Connection) => {
    return connection.manager.find(Survey);
}

export const getSurveyById = async (connection: Connection, surveyId: number) => {
    const survey = await connection.manager.findOne(Survey, {
        where: { survey_id: surveyId }, 
        relations: ["options"], 
    });
    
    if (!survey) {
        throw new Error("Survey non trouvé.");
    }

    return survey;
}

export const addOptionsToSurvey = async (connection: Connection, surveyId: number, optionData: Option[]) => {
    const survey = await connection.manager.findOne(Survey, { where: { survey_id: surveyId } });
    if (!survey) {
        throw new Error("Survey non trouvé.");
    }

    for (const optionItem of optionData) {
        const option = new Option();
        option.name = optionItem.name;
        option.choices = optionItem.choices;
        option.survey = survey;
        option.survey_id = survey.survey_id; 

        await connection.manager.save(option);
    }
}
