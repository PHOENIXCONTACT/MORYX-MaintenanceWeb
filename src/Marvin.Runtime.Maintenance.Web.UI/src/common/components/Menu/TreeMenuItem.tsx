/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import Icon from "@mdi/react";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Col, Collapse, Container, Row } from "reactstrap";
import MenuItemModel, { IconType } from "../../models/MenuItemModel";

interface MenuItemProps {
    MenuItem: MenuItemModel;
    Level: number;
    onMenuItemClicked?(menuItem: MenuItemModel): void;
}

interface MenuItemState {
    IsOpened: boolean;
}

export default class TreeMenuItem extends React.Component<MenuItemProps, MenuItemState> {
    constructor(props: MenuItemProps) {
        super (props);
        this.state = { IsOpened: false };

        this.onMenuItemClicked = this.onMenuItemClicked.bind(this);
    }

    private handleMenuItemClick(e: React.MouseEvent<HTMLElement>): void {
        e.preventDefault();

        this.setState((prevState) => ({ IsOpened: !prevState.IsOpened }));
        this.onMenuItemClicked(this.props.MenuItem);
    }

    private onMenuItemClicked(menuItem: MenuItemModel): void {
        if (this.props.onMenuItemClicked != null) {
            this.props.onMenuItemClicked(menuItem);
        }
    }

    private renderSubMenuItems(): React.ReactNode {
        return this.props.MenuItem.SubMenuItems.map ((menuItem, idx) =>
            <TreeMenuItem key={idx}
                          MenuItem={menuItem}
                          Level={this.props.Level + 1}
                          onMenuItemClicked={this.onMenuItemClicked}
                          />);
    }

    public render(): React.ReactNode {
        const hasSubItems = this.props.MenuItem.SubMenuItems.length > 0;
        const iconType = this.props.MenuItem.IconType == undefined ? IconType.Icon : IconType.Image;
        const defaultContent = (
            <div>
                { this.props.MenuItem.Icon !== undefined && iconType === IconType.Icon &&
                    <Icon path={this.props.MenuItem.Icon} className="icon right-space" />
                }
                { this.props.MenuItem.Icon !== undefined && iconType === IconType.Image &&
                    <img src={this.props.MenuItem.Icon} style={{marginRight: "4px"}} />
                }
                <Icon path={this.props.MenuItem.Icon} className="icon right-sapce" />
                <span style={{wordBreak: "break-all"}}>{this.props.MenuItem.Name}</span>
            </div>
        );

        return (
            <div style={{paddingLeft: this.props.Level * 10 + "px", margin: "5px 0px 5px 0px"}}>
                <Container fluid={true} className="menu-item">
                    <Row>
                        <Col md={10}>
                            <div>
                                { this.props.MenuItem.Content === undefined &&
                                    defaultContent
                                }
                                { this.props.MenuItem.Content !== undefined &&
                                    this.props.MenuItem.Content
                                }
                            </div>
                        </Col>
                        <Col md={2} onClick={(e: React.MouseEvent<HTMLElement>) => this.handleMenuItemClick(e)}>
                            { hasSubItems &&
                                <Icon path={this.state.IsOpened ? mdiChevronUp : mdiChevronDown} className="icon"/>
                            }
                        </Col>
                    </Row>
                </Container>
                <Collapse isOpen={this.state.IsOpened}>
                    {this.renderSubMenuItems()}
                </Collapse>
            </div>
        );
    }
}
