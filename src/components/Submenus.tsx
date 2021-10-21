import { Menu } from 'antd';
import React from 'react';

import Nfts from '../utils/nfts';

let submenuArray = {};

const set = (obj, path, val) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const lastObj = keys.reduce((obj, key) =>
            obj[key] = obj[key] || {},
        obj);
    lastObj[lastKey] = val;
};

function buildSubmenus(data, props) {
    data.map(function(nft) {
        let path = '' + nft.attributes.itemType + '.' + nft.attributes.class + '.' + nft.name; // fix this "markets[0]" dependency
        let val = nft.name + " | " + nft.symbol;
        set(submenuArray, path, val);
    });

    return (
        <>
            {Object.keys(submenuArray).map((itemType) => {
                return (
                    <Menu.SubMenu key={itemType} title={itemType.toUpperCase()} {...props}>
                            {Object.keys(submenuArray[itemType]).map((type) => {
                                return (
                                    <Menu.ItemGroup key={type} title={type.toUpperCase()}>
                                        {Object.keys(submenuArray[itemType][type]).map((nft) => {
                                            return <Menu.Item key={nft}>{nft}</Menu.Item>
                                        })}
                                    </Menu.ItemGroup>
                                )
                            })}
                    </Menu.SubMenu>
                )
            })}
        </>
    )





}

export default function DynamicMenu(props) {


    return (
<>
    {buildSubmenus(Nfts(), props)}
</>
)};
