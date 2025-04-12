import './Card.css'
import React, {useState} from "react";
import CardViewer from './CardViewer.tsx';
import { CardSetType } from '../../utils/types.ts';
import {CardType, Quality} from "../../utils/enums.ts";
interface CardProps {
    title: string;
    cardImg?: string;
    setType?: CardSetType;
    cardType?: CardType;
    quality?: Quality;
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