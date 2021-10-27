import { Menu } from 'antd';
import React from 'react';

import {ItemDisplay} from '../utils/nftProvider';

export default function buildSubmenus() {
    const data = ItemDisplay().data['value'];
    if (data !== undefined) {
        let categories = {};

        data.map(function (nft) {
            let obj = categories;
            let key = [nft.attributes.itemType, nft.attributes.class];
            key.reduce((obj, key) => (obj[key] = obj[key] || []), obj).push(nft);
        });

        let dynamicMenu = Object.keys(categories).map((itemType) => {
            return (
                <Menu.SubMenu key={itemType} title={itemType.toUpperCase()}>
                    {Object.keys(categories[itemType]).map((classType) => {
                        return (
                            <Menu.ItemGroup key={classType} title={classType.toUpperCase()}>
                                {categories[itemType][classType].map((nft) => {
                                    return <Menu.Item key={nft.markets[0].id}>{nft.name}</Menu.Item>
                                })}
                            </Menu.ItemGroup>
                        )
                    })}
                </Menu.SubMenu>
            )
        })

        return dynamicMenu;
    }
}