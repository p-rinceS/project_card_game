

// given the name of the card, we will return the path to the normal map
// in public/FoilNormalMaps/{cardName}gyarados_exNormalMap.png


const getFoilNormalMap = (cardName: string): string => {
    // Convert the card name to lowercase and replace spaces with underscores
    const formattedCardName = cardName.toLowerCase().replace(/\s+/g, '_');
    // Construct the path to the normal map
    return `/FoilNormalMaps/${formattedCardName}NormalMap.png`;
}

export default getFoilNormalMap;