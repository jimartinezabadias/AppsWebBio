import { EducationLevels, Genders } from "../constants";

export interface IEncodeUserPersonalInfo {
    age: number;
    gender: Genders;
    educationLevel: EducationLevels;
    ongoingCareer: string | null;
    occupation: string | null
}