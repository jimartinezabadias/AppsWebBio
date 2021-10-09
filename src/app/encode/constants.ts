export const ENCODE_TEST_URL: string = "/encode"; 
export const GENERATE_GOOGLE_FORMS_LINKS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwepY9MB3D89YYkiQ3SZlN6ha6YXopuioMZDZgJRpVJbXzpU07IAgiWgUCLjJKpZhQ/exec";

export enum RecorderStatus 
{
    Ready = "Listo para grabar",
    Recording = "Grabando..."
};

export const REC_OPTIONS = {mimeType: 'audio/webm'};

export enum Genders
{
    Male = "Masculino",
    Female = "Femenino",
    NonBinary = "No Binario"
}

export enum EducationLevels
{
    incompleteSecondary = "Secundario incompleto",
    completeSecondary = "Secundario completo",
    incompleteTertiary = "Terciario incompleto",
    completeTertiary = "Terciario completo",
    incompleteBachelors = "Universitario incompleto",
    completeBachelors = "Universitario completo"
}

export enum SomnolenceDegrees
{
    totallyAwake = "Me siento activo, vital, alerta o bien despierto.",
    veryHigh = "Funcionando a niveles altos, pero no completamente alerta.",
    relaxed= "Despierto, pero relajado; sensible pero no completamente alerta.",
    littleConfused= "Un poco confundido, decepcionado.",
    confused= "Confundido; pierdo interés en permanecer despierto; ralentizado.",
    tired= "Somnoliento, mareado, luchado contra el sueño; prefiero recostarme.",
    almostSlept= "Ya no lucho contra el sueño, comenzaré a dormirme pronto; tengo pensamientos como sueños.",
    slept= "Dormido."
}

export enum googleFormsURLs
{
    testFormURL = "https://docs.google.com/forms/d/1wutu-cgKSt9cfcq5OjPl7xp1EoafgtWbitAPSSmNJIY/edit",
    testStaiURL = "https://docs.google.com/forms/d/1Wf8b6VcORHDubmI569wVylsPFCd8DIaiaOCEwAnBSV8/edit"
}