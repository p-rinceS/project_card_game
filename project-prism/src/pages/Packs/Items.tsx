import './Items.css';
import { FC, useState } from "react";
import { PackComponent } from "./PackComponent.tsx";
import OpenPackView from "./OpenPackView/OpenPackView.tsx";
import SWSH1Logo from "../../assets/pack-assets/season-0/SWSH1.png";
export enum PackNames {
    ScarletAndViolet = "Scarlet and Violet",
}

type itemsViews = "items" | "open";

const Items: FC = () => {
    const [view, setView] = useState<itemsViews>("items");
    const [selectedPack, setSelectedPack] = useState<PackNames>(PackNames.ScarletAndViolet);
    const [animationClass, setAnimationClass] = useState("fade-in");

    const mockInventory = [
        {
            name: PackNames.ScarletAndViolet,
            amount: 2,
            packLogo: SWSH1Logo, // Replace with actual logo path
        },
    ];

    const handleViewChange = (newView: itemsViews) => {
        setAnimationClass("fade-out");
        setTimeout(() => {
            setView(newView);
            setAnimationClass("fade-in");
        }, 500); // Match the animation duration
    };

    return (
        <div className={animationClass}>
            {view === "items" && (
                <div>
                    <h2>
                        Packs (x
                        {mockInventory
                            .map((item) => item.amount)
                            .reduce((a, b) => a + b, 0)}
                        )
                    </h2>
                    <section className={'pack-list-container'}>

                        <div className="card-container">
                            {mockInventory.map((item) => (
                                <PackComponent
                                    pack={item}
                                    onClick={() => {
                                        handleViewChange("open");
                                        setSelectedPack(item.name);
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            )}
            {view === "open" && (
                <OpenPackView
                    pack={selectedPack}
                    exit={() => handleViewChange("items")}
                />
            )}
        </div>
    );
};

export default Items;