import { Menu } from 'antd';

export const dynamicMenus = (props) => {
    return (
    <Menu.SubMenu key="COLLECTIBLE" title="COLLECTIBLE" {...props}>
        <Menu.ItemGroup title="POSTER" {...props}>
            <Menu.Item key="AYXTVttPfhYmn3jryX5XbRjwPK2m9445mbN2iLyRD6nq">Discovery of Iris | DOI</Menu.Item>
        </Menu.ItemGroup>
    </Menu.SubMenu>
)}

