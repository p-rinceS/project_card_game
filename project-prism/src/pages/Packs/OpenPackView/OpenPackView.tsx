import './OpenPackView.css'
import {FC, useState} from "react";
import getPackImageFromPackName from "../../../utils/getPackImageFromPackName.ts";
import ic_back_arrow from "../../../assets/icons/ic_back_arrow.svg";
import getCardsFromPack from "../../../utils/getCardsFromPack.ts";
import mapStringToPackName from "../../../utils/mapStringToPackName.ts";
import CardViewer from "../../Collection/CardViewer.tsx";
import mapSetTypeToEnum from "../../../utils/mapSetTypeToEnum.ts";
import {CardContents} from "../../../utils/types.ts";

type OpenPackViewProps = {
    pack: string | undefined
    exit: () => void
}



const OpenPackView: FC<OpenPackViewProps> = ({pack, exit}) => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CardContents | undefined>(undefined);

    const handleCardClick = (card: CardContents) => {
        setSelectedCard(card);
        setIsViewerOpen(true);
    };

    const closeViewer = () => {
        setIsViewerOpen(false);
        setSelectedCard(undefined);
    };

    const packCards = getCardsFromPack(mapStringToPackName(pack || ""));
    return (
        <div className={'pack-opening-page-container'}>
            <div className={'back-arrow'} onClick={() => exit()}>
                <img src={ic_back_arrow} alt={"back"} width={50} height={50}></img>
            </div>
            <div className={'pack-opening-container'}>
                <div className={'pack-info-container'}>
                    <img className={'current-pack-image'} src={getPackImageFromPackName(pack)} alt={pack}></img>
                    <h2 className={'pack-title'}>{pack}</h2>
                    <div className={'pack-description'}>
                        <p>Click on a card to inspect it.</p>
                        <p>{packCards.length}</p>
                    </div>
                    <button className={'open-pack-button'}>Open Pack</button>
                </div>
                <div className={'potential-cards-showcase'}>
                    <div className={'scrollable-cards-container'}>
                        {packCards
                            .sort((a, b) => a.attribute.localeCompare(b.attribute)) // Sort cards by attribute
                            .map((card, index) => {
                                const selectedCard: CardContents = {
                                    frontImg: card.image,
                                    attribute: card.attribute,
                                    cardSetType: mapSetTypeToEnum(card.setType), // Map setType based on isEx
                                    name: card.name,
                                    isEx: card.isEx,
                                };
                                return (
                                    <img
                                        onClick={() => handleCardClick(selectedCard)} // Pass the transformed card
                                        width={115}
                                        key={index}
                                        src={card.image} // Use the image property
                                        alt={`Card ${index + 1}`}
                                        className={'potential-card'}
                                    />
                                );
                            })}
                    </div>
                </div>
            </div>

            {isViewerOpen && selectedCard && (
                <CardViewer onClose={closeViewer} card={selectedCard}/>
            )}
        </div>
    );
}

export default OpenPackView;