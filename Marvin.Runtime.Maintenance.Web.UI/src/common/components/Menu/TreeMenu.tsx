import * as React from "react";
import { Collapse } from "reactstrap";
import IMenuItemModel from "../../models/IMenuItemModel";
import IMenuModel from "../../models/IMenuModel";
import TreeMenuItem from "./TreeMenuItem";

export interface IMenuProps {
    Menu: IMenuModel;
    onActiveMenuItemChanged?: (menuItem: IMenuItemModel) => void;
}

export default class TreeMenu extends React.Component<IMenuProps, {}> {

    constructor(props: IMenuProps) {
        super (props);
        this.state = {};
    }

    protected handleMenuItemClick(menuItem: IMenuItemModel) {
        if (this.props.onActiveMenuItemChanged != null) {
            this.props.onActiveMenuItemChanged(menuItem);
        }
    }

    protected renderMenu(menuItems: IMenuItemModel[]) {
        return menuItems.map ((menuItem, idx) => {
            return (
                <TreeMenuItem key={idx} MenuItem={menuItem} Level={0} onMenuItemClicked={this.handleMenuItemClick.bind(this)} />
            );
        });
    }

    public render() {
        return (
            <div>
                {this.renderMenu(this.props.Menu.MenuItems)}
            </div>
        );
    }
}
