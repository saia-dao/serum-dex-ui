import React, {useState, useEffect} from 'react';
import { Menu } from 'antd';

function Nfts() {
    const GALAXY = "galaxy.json";
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
    return nftData
}

export default Nfts;