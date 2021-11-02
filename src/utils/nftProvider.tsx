import React from "react";
import {GALAXY} from "./galaxy";

export const ItemDisplay = () => {
    const data = useNftData();
    return {data};
};

export type ContextState =
    { status: 'LOADING' | 'ERROR'}
|   { status: 'LOADED'; value: Response };

const Context = React.createContext<ContextState | null>(null);

export const useNftData = (): ContextState => {
    const contextState = React.useContext(Context);
    if (contextState === null) {
        throw new Error('UseItemData must be used within an NftDataProvider tag');
    }
    return contextState
};

export const NftDataProvider: React.FC = (props) => {
    const [state, setState] =
        React.useState<ContextState>({status: 'LOADING'});

    React.useEffect(() => {
        setState({status: 'LOADING'});

        (async (): Promise<void> => {
            const result = await GALAXY();
            setState({
                status: 'LOADED',
                value: result,
            })
        })();
    }, []);

    return (
        <Context.Provider value={state}>
            {props.children}
        </Context.Provider>
    );
};
