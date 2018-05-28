import { faCogs, faComment, faSitemap, faSquare } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import NotificationSystem = require("react-notification-system");
import { connect, Dispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import RoutingMenu from "../../common/components/Menu/RoutingMenu";
import IMenuItemModel from "../../common/models/IMenuItemModel";
import IMenuModel from "../../common/models/IMenuModel";
import { IAppState } from "../../common/redux/AppState";
import { ActionType } from "../../common/redux/Types";
import { HealthStateBadge } from "../../dashboard/components/HealthStateBadge";
import ModulesRestClient from "../api/ModulesRestClient";
import IConfig from "../models/Config";
import ServerModuleModel from "../models/ServerModuleModel";
import { updateModules } from "../redux/ModulesActions";
import Module from "./Module";
import ModuleConfiguration from "./ModuleConfiguration";

interface IModulesPropModel {
    RestClient: ModulesRestClient;
    Modules: ServerModuleModel[];
    Configs: IConfig[];
    NotificationSystem?: NotificationSystem.System;
}

interface IModulesDispatchPropModel {
    onUpdateModules?: (modules: ServerModuleModel[]) => void;
}

const mapDispatchToProps = (dispatch: Dispatch<ActionType<{}>>): IModulesDispatchPropModel => {
    return {
        onUpdateModules: (modules: ServerModuleModel[]) => dispatch(updateModules(modules)),
    };
};

const mapStateToProps = (state: IAppState): IModulesPropModel => {
    return {
        RestClient: state.Modules.RestClient,
        Modules: state.Modules.Modules,
        Configs: state.Modules.Configs,
        NotificationSystem: state.Common.NotificationSystem,
    };
};

interface IModulesStateModel {
    MenuModel: IMenuModel;
}

class Modules extends React.Component<IModulesPropModel & IModulesDispatchPropModel, IModulesStateModel> {
    private updateModulesTimer: number;

    constructor(props: IModulesPropModel & IModulesDispatchPropModel) {
        super(props);
        this.state = { MenuModel: { MenuItems: props.Modules.map((module, idx) => this.createMenuItem(module)) } };

        this.modulesUpdater = this.modulesUpdater.bind(this);
    }

    public componentDidMount() {
        this.updateModulesTimer = setInterval(this.modulesUpdater, 5000);
    }

    public componentWillReceiveProps(nextProps: IModulesPropModel) {
        this.setState({ MenuModel: { ...this.state.MenuModel, MenuItems: nextProps.Modules.map((module, idx) => this.createMenuItem(module)) } });
    }

    public modulesUpdater() {
        this.props.RestClient.modules().then((data) => this.props.onUpdateModules(data));
    }

    public createMenuItem(moduleModel: ServerModuleModel): IMenuItemModel {
        return {
            Name: moduleModel.Name,
            NavPath: "/modules/" + moduleModel.Name,
            Icon: faSquare,
            Content: (<span className="font-small" style={{float: "right"}}><HealthStateBadge HealthState={moduleModel.HealthState} /></span>),
            SubMenuItems:
            [
                {
                    Name: "Configuration",
                    NavPath: "/modules/" + moduleModel.Name + "/configuration",
                    Icon: faCogs,
                    SubMenuItems: [],
                },
            ],
        };
    }

    public preRenderRoutesList() {
        const routes: any[] = [];
        let idx = 0;

        this.state.MenuModel.MenuItems.forEach((menuItem) => {
            const module = this.props.Modules.filter(function(element, index, array) { return element.Name == menuItem.Name; })[0];
            routes.push(<Route key={idx} path={menuItem.NavPath} exact={true} render={() => <Module Module={module} RestClient={this.props.RestClient} />}/>);

            menuItem.SubMenuItems.forEach((subMenuItem) => {
                routes.push(<Route key={idx} path={subMenuItem.NavPath} exact={true}
                                   render={() => <ModuleConfiguration ModuleName={module.Name}
                                                                      RestClient={this.props.RestClient}
                                                                      NotificationSystem={this.props.NotificationSystem} />}/>);
                ++idx;
            });

            ++idx;
        });

        return routes;
    }

    public render() {
        return (
            <Row>
                <Col md={3}>
                    <Card>
                        <CardHeader tag="h2">
                            <FontAwesomeIcon icon={faSitemap} className="right-space" />
                            Modules
                        </CardHeader>
                        <CardBody>
                            <RoutingMenu Menu={this.state.MenuModel} />
                        </CardBody>
                    </Card>
                </Col>
                <Col md={9}>
                    <Switch>
                        <Route exact={true} path="/modules" render={() =>
                            <Card>
                                <CardHeader tag="h2">
                                    <FontAwesomeIcon icon={faComment} className="right-space" />
                                    Information
                                </CardHeader>
                                <CardBody>
                                    <span className="font-italic font-small">Watch, configure and maintain all available modules. Please select a module to proceed...</span>
                                </CardBody>
                            </Card>
                        } />
                        {this.preRenderRoutesList()}
                    </Switch>
                </Col>
            </Row>
        );
    }
}

export default connect<IModulesPropModel, IModulesDispatchPropModel>(mapStateToProps, mapDispatchToProps)(Modules);
