export const ENCODE_TEST_URL: string = "/encode"; 

export const VIDEO_PATH: string = "assets/videos/videoEncode.mp4";

export enum PerpetratorId {
    PERP_1,
    PERP_2
}

export enum RecorderStatus
{
    Ready = "Listo para grabar",
    Recording = "Grabando..."
};

export enum VideoState
{
    Play,
    Pause
};

export const REC_OPTIONS = { mimeType: 'audio/webm' };

export enum Gender
{
    Male = "Masculino",
    Female = "Femenino",
    NonBinary = "No Binario"
}

export enum EducationLevel
{
    incompleteSecondary = "Secundario incompleto",
    completeSecondary = "Secundario completo",
    incompleteTertiary = "Terciario incompleto",
    completeTertiary = "Terciario completo",
    incompleteBachelors = "Universitario incompleto",
    completeBachelors = "Universitario completo"
}

export enum SomnolenceDegree
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

export enum PerpetratorCondition {
    A = "Sospechoso 1 Presente, Sospechoso 2 Ausente",
    B = "Sospechoso 2 Presente, Sospechoso 1 Ausente"
}
