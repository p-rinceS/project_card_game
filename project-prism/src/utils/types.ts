export enum PackNames {
    ScarletAndViolet = "Scarlet and Violet",
}

export type Pack = {
    name: string;
    amount: number;
};

export type itemsViews = "items" | { view: "open"; pack: Pack };


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
