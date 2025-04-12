import { FC, } from "react";
import './PackComponent.css';
import getPackImageFromName from "../../utils/getPackImageFromPackName.ts";
import { Pack} from "../../utils/types.ts";


type PackComponentProps = {
    pack: Pack;
    onClick: () => void;
};

export const PackComponent: FC<PackComponentProps> = ({ pack, onClick}) => {
    return (
        <div className="pack-component">
            <img
                className="pack-image"
                src={getPackImageFromName(pack.name)}
                alt={pack.name}
                onClick={onClick}
            />
            <img className={'packIcon'} src={pack.packLogo} alt={pack.name}></img>
            <div className="pack-amount-count">x{pack.amount}</div>
        </div>
    );
};

