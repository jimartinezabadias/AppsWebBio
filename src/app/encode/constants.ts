export const ENCODE_TEST_URL = "/encode"; 

export const VIDEO_PATH = "assets/videos/videoEncode.mp4";

export const SelectionPairs = {
    "pair_1" : {
        fakeImage: "assets/screenshots/1_fakeImage.png",
        realImage: "assets/screenshots/1_realImage.png",
        pairNumber: 1
    },
    "pair_2" : {
        fakeImage: "assets/screenshots/2_fakeImage.png",
        realImage: "assets/screenshots/2_realImage.png",
        pairNumber: 2
    }
};
  
export const SelectionScreenshots = {
    selectionPairs: SelectionPairs
};

export enum PerpetratorId {
    PERP_1,
    PERP_2
}
export const Perpetrator1Id = "PERP_1";

export const Perpetrator2Id = "PERP_2";

export const Room1Title = "Ronda 1 de 2";

export const Room2Title = "Ronda 2 de 2";

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
    A = "Perpetrador 1 Presente, Perpetrador 2 Ausente",
    B = "Perpetrador 2 Presente, Perpetrador 1 Ausente"
}

