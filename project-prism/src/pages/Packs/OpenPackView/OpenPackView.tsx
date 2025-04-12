import './OpenPackView.css'
import {FC, useState} from "react";
import getPackImageFromPackName from "../../../utils/getPackImageFromPackName.ts";
import ic_back_arrow from "../../../assets/icons/ic_back_arrow.svg";
import getCardsFromPack from "../../../utils/getCardsFromPack.ts";
import mapStringToPackName from "../../../utils/mapStringToPackName.ts";
import CardViewer from "../../Collection/CardViewer.tsx";
import {CardSetType} from "../../../utils/enums.ts";

type OpenPackViewProps = {
    pack: string | undefined
    exit: () => void
}

type SelectedPreviewCard = {
    image: string;
    attribute: string;
    setType?: CardSetType
}

const OpenPackView: FC<OpenPackViewProps> = ({pack, exit}) => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<SelectedPreviewCard | undefined>(undefined);

    const handleCardClick = (card: SelectedPreviewCard) => {
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
                <img className={'current-pack-image'} src={getPackImageFromPackName(pack)} alt={pack}></img>
                <div className={'potential-cards-showcase'}>
                    {packCards
                        .sort((a, b) => a.attribute.localeCompare(b.attribute)) // Sort cards by attribute
                        .map((card, index) => {
                            const selectedCard: SelectedPreviewCard = {
                                image: card.image,
                                attribute: card.attribute,
                                setType: card.isEx ? CardSetType.foil : CardSetType.base, // Map setType based on isEx
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

            {isViewerOpen && selectedCard && (
                <CardViewer cardImg={selectedCard.image} onClose={closeViewer} cardSetType={selectedCard.setType}/>
            )}
        </div>
    );
}

export default OpenPackView;