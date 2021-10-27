import React from "react";

//TODO: change to Star Atlas feed before merge
const GALAXY = "galaxy.json";

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
            const result = await fetch(GALAXY
                , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
            if (result.ok) {
                setState({
                    status: 'LOADED',
                    value: await result.json(),
                });
            } else {
                setState({status: 'ERROR'})
            }
        })();
    }, []);

    return (
        <Context.Provider value={state}>
            {props.children}
        </Context.Provider>
    );
};
