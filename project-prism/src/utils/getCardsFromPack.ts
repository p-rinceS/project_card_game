import scarletVioletCards from "./CardImports/scarlet-violet-cards/sv_cards.ts";
import { PackNames } from "./types.ts";

const getCardsFromPack = (packName: PackNames | undefined) => {
    if (packName === "Scarlet and Violet") {
        // Flatten all card categories into a single array
        return [
            ...Object.values(scarletVioletCards.pokemon),
            ...Object.values(scarletVioletCards.trainer),
            ...Object.values(scarletVioletCards.energy),
        ];
    }
    return [];
};

export default getCardsFromPack;