import './OpenPackView.css'
import {FC, useState} from "react";
import getPackImageFromPackName from "../../../utils/getPackImageFromPackName.ts";
import ic_back_arrow from "../../../assets/icons/ic_back_arrow.svg";
import getCardsFromPack from "../../../utils/getCardsFromPack.ts";
import mapStringToPackName from "../../../utils/mapStringToPackName.ts";
import CardViewer from "../../Collection/CardViewer.tsx";
import mapSetTypeToEnum from "../../../utils/mapSetTypeToEnum.ts";
import {CardContents} from "../../../utils/types.ts";
import {TrainerCard} from "../../../utils/CardImports/scarlet-violet-cards/sv_cards.ts";

type OpenPackViewProps = {
    pack: string | undefined
    exit: () => void
}



const OpenPackView: FC<OpenPackViewProps> = ({pack, exit}) => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CardContents | undefined>(undefined);
    const [isSlidingOut, setIsSlidingOut] = useState(false);

    const handleCardClick = (card: CardContents) => {
        setSelectedCard(card);
        setIsViewerOpen(true);
    };

    const closeViewer = () => {
        setIsViewerOpen(false);
        setSelectedCard(undefined);
    };

    const handleBackClick = () => {
        setIsSlidingOut(true);
        setTimeout(() => {
            exit(); // Call the exit function after the animation
        }, 500); // Match the animation duration
    };

    const packCards = getCardsFromPack(mapStringToPackName(pack || ""));
    return (
        <div className={`pack-opening-page-container ${isSlidingOut ? "slide-out" : ""}`}>
            <div className={'back-arrow'} onClick={() => {
                handleBackClick();
            }}>
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
                            .sort((a, b) => {
                                // Check if both cards are trainers (have the `type` attribute)
                                const aIsTrainer = "type" in a;
                                const bIsTrainer = "type" in b;

                                // Check if both cards are energy cards (have the `energyType` attribute)
                                const aIsEnergy = "energyType" in a;
                                const bIsEnergy = "energyType" in b;

                                // Ensure EnergyCards are always at the bottom
                                if (aIsEnergy && !bIsEnergy) return 1;
                                if (!aIsEnergy && bIsEnergy) return -1;

                                // Check if both cards are fullart Pokémon
                                const aIsFullArt = a.setType === "fullart";
                                const bIsFullArt = b.setType === "fullart";

                                // If one card is a trainer and the other is not, prioritize non-trainers
                                if (aIsTrainer && !bIsTrainer) return 1;
                                if (!aIsTrainer && bIsTrainer) return -1;

                                // If one card is fullart and the other is not, prioritize fullart after regular cards
                                if (aIsFullArt && !bIsFullArt) return 1;
                                if (!aIsFullArt && bIsFullArt) return -1;

                                // If both are trainers, sort by `type`
                                if (aIsTrainer && bIsTrainer) {
                                    const trainerTypePriority = {
                                        "Supporter": 1,
                                        "Stadium": 2,
                                        "Pokemon Tool": 3,
                                        "Item": 4,
                                    };

                                    const aTrainer = a as TrainerCard;
                                    const bTrainer = b as TrainerCard;

                                    // Prioritize fullArt supporter cards before regular supporter cards
                                    if (aTrainer.type === "Supporter" && bTrainer.type === "Supporter") {
                                        const aIsFullArt = aTrainer.setType === "fullArtTrainer";
                                        const bIsFullArt = bTrainer.setType === "fullArtTrainer";

                                        if (aIsFullArt && !bIsFullArt) return -1;
                                        if (!aIsFullArt && bIsFullArt) return 1;
                                    }

                                    return trainerTypePriority[aTrainer.type] - trainerTypePriority[bTrainer.type];
                                }

                                // If both are Pokémon, sort by `attribute` and then by `name`
                                if (!aIsTrainer && !bIsTrainer) {
                                    const attributeComparison = a.attribute?.localeCompare(b.attribute || "");
                                    if (attributeComparison !== 0) {
                                        return attributeComparison;
                                    }
                                    return a.name.localeCompare(b.name);
                                }

                                // Otherwise, maintain the original order
                                return 0;
                            })
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