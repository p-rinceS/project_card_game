// Given the pack name, return a list of cards that can be obtained from it
import scarletVioletCards from "./CardImports/scarlet-violet-cards/sv_cards.ts";
import {PackNames} from "./types.ts";


const getCardsFromPack = (packName: PackNames | undefined) => {
    if (packName === "Scarlet and Violet") {
        return Object.values(scarletVioletCards); // Return card objects
    }
    return [];
};

export default getCardsFromPack;