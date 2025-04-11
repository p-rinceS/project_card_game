
import {FC} from 'react'
import CardShelf from "./CardShelf.tsx";
import Card, {CardSetType} from "./Card.tsx";
import Hoppip from "../assets/card-assets/dev-cards/Hoppip.png";
import Blaziken from "../assets/card-assets/dev-cards/foils/Blaziken/Blaziken.png";
import Combusken from "../assets/card-assets/dev-cards/Combusken.png";
import Tadbulb from "../assets/card-assets/dev-cards/Tadbulb.png";
import Wailord from "../assets/card-assets/dev-cards/Wailord.png";


type devProps = {
    title: string;
    description: string;

}

const Home: FC<devProps> = ({ title, description }) => {
    return (
        <>
            <h1 className="">{title}</h1>
            <p className="">{description}</p>
            <CardShelf capacity={2}>
                <Card title={"Hoppip"} cardImg={Hoppip}></Card>
                <Card title={"Blaziken"} cardImg={Blaziken} setType={CardSetType.foil}></Card>
                <Card title={"Combusken"} cardImg={Combusken}></Card>
                <Card title={"Tadbulb"} cardImg={Tadbulb}></Card>
                <Card title={"Wailord"} cardImg={Wailord}></Card>
                <Card title={"Wailord"} cardImg={Wailord}></Card>
                <Card title={"Hoppip"} cardImg={Hoppip}></Card>
                <Card title={"Blaziken"} cardImg={Blaziken} setType={CardSetType.foil}></Card>
                <Card title={"Combusken"} cardImg={Combusken}></Card>
                <Card title={"Tadbulb"} cardImg={Tadbulb}></Card>
                <Card title={"Wailord"} cardImg={Wailord}></Card>
                <Card title={"Wailord"} cardImg={Wailord}></Card>
            </CardShelf>
        </>
    )
}

export default Home;