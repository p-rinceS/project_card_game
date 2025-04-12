import {PackNames} from "./types.ts";


const mapStringToPackName = (packName: string): PackNames | undefined => {
    return Object.values(PackNames).find((name) => name === packName);
};

export default mapStringToPackName;