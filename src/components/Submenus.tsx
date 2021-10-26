import { Menu } from 'antd';
import React from 'react';

import {ItemDisplay} from '../utils/nftProvider';

export default function buildSubmenus() {
    const data = ItemDisplay().data['value'];
    let categories = {};
    if (data !== undefined) {

        data.map(function(nft) {
            console.log(nft.name, nft.attributes);
            const itemType = nft['attributes']['itemType'];
            const classType = nft['attributes']['class'];

            if (!categories[itemType]) {
                categories[itemType] = {}
            } else if (!categories[itemType][classType]) {
                categories[itemType][classType] = [nft]
            } else {
                categories[itemType][classType].push(nft);
            }
        });

        console.log("categories", categories)

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