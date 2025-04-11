import './Card.css'
import React, {useState} from "react";
import CardViewer from './CardViewer';
interface CardProps {
    title: string;
    cardImg?: string;
    setType?: CardSetType;
    cardType?: CardType;
    quality?: Quality;
}

export enum Quality {
    common = "common",
    uncommon = "uncommon",
    rare = "rare",
    ultraRare = "ultraRare",
}

export enum CardType {
    trainer = "trainer",
    pokemon = "pokemon",
    energy = "energy",
}

export enum CardSetType {
    base = "base",
    holographic = "holographic",
    reverseHolographic = "reverseHolographic",
    promo = "promo",
    lenticular = "lenticular",
    foil = "foil",
    fullArt = "fullArt",
}

//todo use quanlity, cardtype, etc. later
const Card: React.FC<CardProps> = ({ title, cardImg,setType , quality, cardType  }) => {
    const [isViewerOpen, setViewerOpen] = useState(false);
    const handleCardClick = () => {
        setViewerOpen(true);
    };
    const closeViewer = () => {
        setViewerOpen(false);
    };
    return (
        <div>
            <img
                src={cardImg}
                className={"card"}
                alt={title}
                width={150}
                onClick={handleCardClick}
            />
            {isViewerOpen && <CardViewer cardImg={cardImg} onClose={closeViewer} cardSetType={setType} />}
        </div>
    );
};

export default Card;