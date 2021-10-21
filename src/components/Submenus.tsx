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
            {Object.keys(submenuArray).map(function (itemType) {
                return (
                    <Menu.SubMenu title={itemType.toUpperCase()} {...props}>
                            {/*console.log(Object.keys(submenuArray[itemType]))*/}
                            {Object.keys(submenuArray[itemType]).map(function (type) {
                                return (
                                    <Menu.ItemGroup title={type.toUpperCase()}>
                                        {Object.keys(submenuArray[itemType][type]).map(function (nft) {
                                            console.log(nft)
                                            return <Menu.Item key="blerg">{nft}</Menu.Item>
                                            }
                                        )}

                                    </Menu.ItemGroup>
                                )}
                            )}

                    </Menu.SubMenu>
                )
            })
        }

        </>
    )





}

export default function DynamicMenu(props) {


    return (
<>
    {buildSubmenus(Nfts(), {...props})}
</>
)};
