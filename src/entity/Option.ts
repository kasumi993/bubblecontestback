import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Survey } from "./Survey";

@Entity()
export class Option {
    @PrimaryGeneratedColumn()
    option_id!: number;

    @Column()
    survey_id!: number;

    @Column()
    name!: string;

    @Column()
    choices!: number;

    @ManyToOne(() => Survey, survey => survey.options)
    survey!: Survey;
}
