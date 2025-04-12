import { CardSetType } from "./enums";

const mapSetTypeToEnum = (setType: string): CardSetType => {
    const mapping: Record<string, CardSetType> = {
        base: CardSetType.base,
        holographic: CardSetType.holographic,
        foil: CardSetType.foil,
    };

    return mapping[setType] || CardSetType.base; // Default to CardSetType.base if no match
};

export default mapSetTypeToEnum;