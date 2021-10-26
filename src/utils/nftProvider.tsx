import React from "react";

const GALAXY = "galaxy.json";

export const ItemDisplay = () => {
    const data = useItemData();

    // if (data.status === 'LOADING') {
    //     return <Spin/>
    // } else if (data.status === 'ERROR') {
    //     return <div>Unable to load item data</div>;
    // }

    return {data};
};

export type ContextState =
    { status: 'LOADING' | 'ERROR'}
|   { status: 'LOADED'; value: Response };

const Context = React.createContext<ContextState | null>(null);

export const useItemData = (): ContextState => {
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
                console.log("GALAXY LOADED")
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


// export const TestItemDataProvider: React.FC<{value: ContextState}> = (props) => (
//     <Context.Provider value={props.value}>
//         {props.children}
//     </Context.Provider>
// )
