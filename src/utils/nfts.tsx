import React, {useState, useEffect} from 'react';

function Nfts() {

    const GALAXY = "https://galaxy.staratlas.com/nfts";
    const [nftData, setNftData] = useState<any[]>([]);
    const getNfts = () => {
        fetch(GALAXY
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(function (response) {
                console.log(response)
                return response.json();
            })
            .then(function (nftJson) {
                console.log(nftJson);
                setNftData(nftJson)
            });
    }
    useEffect(() => {
        getNfts()
    }, [])
    return (
        <div className="NFTS">
            {
                nftData && nftData.length > 0 && nftData.map((item) => <p>{item?.name}</p>)
            }
        </div>
    );
}

export default Nfts;