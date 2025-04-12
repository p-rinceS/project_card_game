import './Card.css';
import React, { useState, useRef } from "react";
import CardViewer from './CardViewer.tsx';
import {CardContents} from '../../utils/types.ts';
import {CardType, Quality} from "../../utils/enums.ts";
import {CardSetType} from "../../utils/enums.ts";

interface CardProps {
    title: string;
    cardImg?: string;
    setType?: CardSetType;
    cardType?: CardType;
    quality?: Quality;
    attribute?: string;
}

const Card: React.FC<CardProps> = ({ title, cardImg, setType, attribute, quality, cardType }) => {
    const [isViewerOpen, setViewerOpen] = useState(false);
    const cardRef = useRef<HTMLImageElement>(null);

    const thisCard: CardContents = {
        frontImg: cardImg || "",
        cardSetType: setType || CardSetType.base,
        isEx: false,
        attribute: attribute,
        name: title,
    }

    const handleCardClick = () => {
        setViewerOpen(true);
    };

    const closeViewer = () => {
        setViewerOpen(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;

        card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    };

    return (
        <div>
            <img
                ref={cardRef}
                src={cardImg}
                className={"card"}
                alt={title}
                width={150}
                onClick={handleCardClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            />
            {isViewerOpen && (
                <CardViewer
                    card={thisCard}
                    onClose={closeViewer}
                />
            )}
        </div>
    );
};

export default Card;