export enum PackNames {
    ScarletAndViolet = "Scarlet and Violet",
}

export type Pack = {
    name: string;
    amount: number;
};

export type itemsViews = "items" | { view: "open"; pack: Pack };

export type CardContents = {
    frontImg: string;
    cardSetType: string;
    isEx: Boolean;
    attribute?: string | undefined;
    name: string;
    isTrainer?: Boolean;
    isEnergy?: Boolean;
    isFullArt?: Boolean;
}