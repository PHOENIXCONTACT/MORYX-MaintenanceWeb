import { faAngleDown, faAngleRight } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Col, Collapse, Container, Row } from "reactstrap";
import IMenuItemModel from "../../models/IMenuItemModel";

interface IMenuItemProps {
    MenuItem: IMenuItemModel;
    Level: number;
    onMenuItemClicked?: (menuItem: IMenuItemModel) => void;
}

interface IMenuItemState {
    IsOpened: boolean;
}

export default class TreeMenuItem extends React.Component<IMenuItemProps, IMenuItemState> {
    constructor(props: IMenuItemProps) {
        super (props);
        this.state = { IsOpened: false };

        this.onMenuItemClicked = this.onMenuItemClicked.bind(this);
    }

    private handleMenuItemClick(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();

        this.setState((prevState) => ({ IsOpened: !prevState.IsOpened }));
        this.onMenuItemClicked(this.props.MenuItem);
    }

    private onMenuItemClicked(menuItem: IMenuItemModel) {
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

    public render() {
        const hasSubItems = this.props.MenuItem.SubMenuItems.length > 0;

        return (
            <div style={{paddingLeft: this.props.Level * 10 + "px", margin: "5px 0px 5px 0px"}}>
                <Container fluid={true} className="menu-item" onClick={(e: React.MouseEvent<HTMLElement>) => this.handleMenuItemClick(e)}>
                    <Row>
                        <Col md={10}>
                            <div>
                                { this.props.MenuItem.Icon != undefined &&
                                    <FontAwesomeIcon icon={this.props.MenuItem.Icon} style={{marginRight: "4px"}} />
                                }
                                <span style={{wordBreak: "break-all"}}>{this.props.MenuItem.Name}</span>
                                {this.props.MenuItem.Content}
                            </div>
                        </Col>
                        <Col md={2}>
                            { hasSubItems &&
                                <FontAwesomeIcon icon={this.state.IsOpened ? faAngleDown : faAngleRight} />
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
