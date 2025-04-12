import SV1_pack_Gyarados from "../assets/pack-assets/season-0/SV1_pack_Gyarados.png";

const getPackImageFromName = (name: string | undefined): string => {
    switch (name) {
        case "Scarlet and Violet":
            return SV1_pack_Gyarados;
        default:
            return ""; // Return an empty string or a default placeholder image
    }
};

export default getPackImageFromName;
