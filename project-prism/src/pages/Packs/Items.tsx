import { FC, useState } from "react";
import {PackComponent} from "./PackComponent.tsx";
import OpenPackView from "./OpenPackView/OpenPackView.tsx";



type PacksProps = {
    title: string;
}

// Description of Items
// Items is a component that displays a list of packs that the user will be able to open
// Will contain a list of packs which contain random cards that the user can then add to their collection
// Items will cost $1.50 to open initially
// Cards can be put on a market place
// More packs will be added in the future
// Currently you can click on a pack to view the possible cards that can be obtained from it



export enum PackNames {
    ScarletAndViolet = "Scarlet and Violet",
}

type itemsViews = "items" | "open";


const Items: FC<PacksProps> = () => {

    const [view, setView] = useState<itemsViews>("items");
    const [selectedPack, setSelectedPack] = useState<PackNames>(PackNames.ScarletAndViolet);

    const mockInventory = [
        {
            name: PackNames.ScarletAndViolet,
            amount: 2,
        },
    ];



    return(<>{
    view === "items" &&
            <div>
                <section>
                    <h2>Packs (x{mockInventory.map(
                        (item) => item.amount).reduce((a, b) => a + b, 0
                    )})</h2>
                    {/*     map through mockInventory to display card packs*/}
                    <div className="card-container">
                        {mockInventory.map((item) => (
                            <PackComponent pack={item} onClick={
                                () => {
                                    setView("open");
                                    setSelectedPack(item.name);
                                }
                            }/>
                        ))}
                    </div>
                </section>
            </div>
            }
            {
                view === "open" &&
                <OpenPackView pack={selectedPack} exit={() => setView("items")}></OpenPackView>
            }
        </>
    );
}


export default Items;