import { Menu } from 'antd';
import React from 'react';

import Nfts from '../utils/nfts';

export default function buildSubmenus() {
    let submenuArray = {};

    const set = (obj, path, val) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const lastObj = keys.reduce((obj, key) =>
                obj[key] = obj[key] || {},
            obj);
        lastObj[lastKey] = val;
    };

    Nfts().map(function(nft) {
        const path = '' + nft.attributes.itemType + '.' + nft.attributes.class + '.' + nft.name;
        const val = nft.name + " | " + nft.symbol;
        set(submenuArray, path, val);
        return;
    });

    let dynamicMenu = Object.keys(submenuArray).map((itemType) => {

        return (
            <Menu.SubMenu key={itemType} title={itemType.toUpperCase()}>
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
    })

    return dynamicMenu;

}