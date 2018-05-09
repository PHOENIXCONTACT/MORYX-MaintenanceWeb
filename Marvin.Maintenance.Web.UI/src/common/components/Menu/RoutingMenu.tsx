import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Collapse } from "reactstrap";
import IMenuItemModel from "../../models/IMenuItemModel";
import IMenuModel from "../../models/IMenuModel";
import RoutingMenuItem from "./RoutingMenuItem";
import { IMenuProps } from "./TreeMenu";

class RoutingMenu extends React.Component<RouteComponentProps<{}> & IMenuProps, {}> {

    constructor(props: RouteComponentProps<{}> & IMenuProps) {
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
                <RoutingMenuItem key={idx} MenuItem={menuItem} Level={0} onMenuItemClicked={this.handleMenuItemClick.bind(this)} />
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

export default withRouter<RouteComponentProps<{}> & IMenuProps>(RoutingMenu);
