import { DataSource, createConnection, getConnection, getRepository } from "typeorm";
import { Survey } from "../entity/Survey";
import { Option } from "../entity/Option";

describe("test surveys endpoint", () => {
    it("shoudl return true", async () => {
        expect(true).toBe(true);
    });
});
