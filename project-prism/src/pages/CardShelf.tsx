import React, { FC, ReactNode } from "react";
import './CardShelf.css';

type CardShelfProps = {
    children: ReactNode;
    capacity: number;
};

// Utility function to chunk an array into smaller arrays of a given size
const chunkArray = (array: ReactNode[], size: number): ReactNode[][] => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

const CardShelf: FC<CardShelfProps> = ({ children }) => {
    const sortedChildren = React.Children.toArray(children).sort((a: any, b: any) => {
        const nameA = a.props.title.toLowerCase();
        const nameB = b.props.title.toLowerCase();
        return nameA.localeCompare(nameB);
    });

    const shelves = chunkArray(sortedChildren, 5);

    return (
        <div>
            {shelves.map((shelf, index) => (
                <div key={index} className={'shelf-container'}>
                    <div className="card-container">
                        {shelf.map((child, idx) => (
                            <React.Fragment key={idx}>{child}</React.Fragment>
                        ))}
                    </div>
                    <div className={"shelf-bottom"} />
                </div>
            ))}
        </div>
    );
};

export default CardShelf;