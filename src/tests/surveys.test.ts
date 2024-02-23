import { createConnection, getConnection, getRepository } from "typeorm";
import { Survey } from "../entity/Survey";
import { Option } from "../entity/Option";
import { addOptionsToSurvey, getSurveyByName } from "../services/Survey";

const mockedSurvey = 
    {
        "title": "Test Film",
        "description": "Quel est le meilleur !",
        "premium": false
      };

const mockedOption = {name: "Le Roi Lion", choices: 0}
const mockedOption2 = {name: "La Lionne Reine", choices: 2}
const mockedOption3 = {name: "Le Lion Roi", choices: 3}
const mockedOption4 = {name: "La Lionne Reine", choices: 4}

const allOptions = [mockedOption, mockedOption2, mockedOption3, mockedOption4];

beforeAll(() => {
    return createConnection({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [Survey, Option],
        synchronize: true,
        logging: false
    });
});

afterAll(() => {
    let conn = getConnection();
    return conn.close();
});

describe("test surveys endpoint", () => {
    it("should create survey", async () => {
        await getRepository(Survey).save(getRepository(Survey).create(mockedSurvey));
        
        const survey = await getSurveyByName(getRepository(Survey), "Test Film") as Survey;

        expect(survey.title).toBe("Test Film");
    });

    it("should create options", async () => {
        const survey = await getSurveyByName(getRepository(Survey), "Test Film") as Survey;

        await addOptionsToSurvey(getRepository(Option),survey.survey_id, allOptions);
    
        const options = await getRepository(Option).find({
            where: {
                survey_id: survey.survey_id
            }
        });

        expect(options.length).toBe(4);
    })

    it("survey should have options", async () => {
        const survey = await getSurveyByName(getRepository(Survey), "Test Film") as Survey;

        expect(survey.options.length).toBe(4);
    });

    it("should delete options", async () => {
        const survey = await getSurveyByName(getRepository(Survey), "Test Film") as Survey;

        await getRepository(Option).delete({
            survey_id: survey.survey_id
        });

        const options = await getRepository(Option).find({
            where: {
                survey_id: survey.survey_id
            }
        });

        expect(options.length).toBe(0);
    });

    it("shoud update survey", async () => {
        let survey = await getSurveyByName(getRepository(Survey), "Test Film") as Survey;

        survey.title = "Test Film Updated";

        await getRepository(Survey).save(survey);

        const updatedSurvey = await getSurveyByName(getRepository(Survey), "Test Film Updated") as Survey;

        expect(updatedSurvey.title).toBe("Test Film Updated");
    });


    it("should delete survey", async () => {
        const survey = await getSurveyByName(getRepository(Survey), "Test Film Updated") as Survey;

        await getRepository(Survey).remove(survey);

        const deletedSurvey = await getSurveyByName(getRepository(Survey), "Test Film Updated") as Survey;

        expect(deletedSurvey).toBeNull();
    });
});
