import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Option } from "./Option";

@Entity()
export class Survey {
    @PrimaryGeneratedColumn()
    survey_id!: number;

    @Column()
    title!: string;

    @Column("text")
    description!: string;

    @Column()
    premium!: boolean;

    @OneToMany(() => Option, option => option.survey)
    options!: Option[];
}
