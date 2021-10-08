
export enum EventVariant {
    Lecture,
    Excercise,
    Practise,
    LectureOrExcercise,
    Unknown
}

const label_mapping = Object.entries({
    "V": EventVariant.Lecture,
    "Ü": EventVariant.Excercise,
    "PT": EventVariant.Practise,
    "VÜ": EventVariant.LectureOrExcercise
});

export function rawToEventVariant(raw: string) {
    return label_mapping.find(([short, _]) => raw.includes(short))?.[1] ?? EventVariant.Unknown;
}