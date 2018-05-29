import { faBriefcase, faClone, faComment } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import NotificationSystem = require("react-notification-system");
import { connect, Dispatch } from "react-redux";
import { Link, Route, Switch } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import RoutingMenu from "../../common/components/Menu/RoutingMenu";
import IMenuItemModel from "../../common/models/IMenuItemModel";
import IMenuModel from "../../common/models/IMenuModel";
import { AppState } from "../../common/redux/AppState";
import { ActionType } from "../../common/redux/Types";
import DatabasesRestClient from "../api/DatabasesRestClient";
import DataModel from "../models/DataModel";
import { updateDatabaseConfigs } from "../redux/DatabaseActions";
import DatabaseModel from "./DatabaseModel";

interface DatabasesPropsModel {
    RestClient?: DatabasesRestClient;
    DatabaseConfigs?: DataModel[];
    NotificationSystem?: NotificationSystem.System;
}

interface DatabasesDispatchPropModel {
    onUpdateDatabaseConfigs?(databaseConfigs: DataModel[]): void;
}

const mapStateToProps = (state: AppState): DatabasesPropsModel => {
    return {
        RestClient: state.Databases.RestClient,
        DatabaseConfigs: state.Databases.DatabaseConfigs,
        NotificationSystem: state.Common.NotificationSystem,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ActionType<{}>>): DatabasesDispatchPropModel => {
    return {
        onUpdateDatabaseConfigs: (databaseConfigs: DataModel[]) => dispatch(updateDatabaseConfigs(databaseConfigs)),
    };
};

interface DatabaseStateModel {
    MenuModel: IMenuModel;
    IsLoading: boolean;
}

class Database extends React.Component<DatabasesPropsModel & DatabasesDispatchPropModel, DatabaseStateModel> {
    constructor(props: DatabasesPropsModel & DatabasesDispatchPropModel) {
        super(props);
        this.state = { MenuModel: { MenuItems: [] }, IsLoading: false };
    }

    public componentDidMount(): void {
        this.loadDatabases();
    }

    private loadDatabases(): void {
        this.setState({ IsLoading: true });

        this.props.RestClient.databaseModels().then((data) => {
            this.props.onUpdateDatabaseConfigs(data);
            this.setState({ MenuModel: { MenuItems: data.map((dataModel, idx) => Database.createMenuItem(dataModel)) }, IsLoading: false });
        });
    }

    private static createMenuItem(dataModel: DataModel): IMenuItemModel {
        return {
            Name: dataModel.TargetModel,
            NavPath: "/databases/" + dataModel.TargetModel,
            Icon: faBriefcase,
            SubMenuItems: [],
        };
    }

    public preRenderRoutesList(): any[] {
        const routes: any[] = [];
        let idx = 0;

        this.props.DatabaseConfigs.forEach((model) => {
            routes.push(<Route key={idx} path={"/databases/" + model.TargetModel} exact={true} render={() => <DatabaseModel DataModel={model} RestClient={this.props.RestClient} NotificationSystem={this.props.NotificationSystem}>{model.TargetModel}</DatabaseModel>}/>);
            ++idx;
        });

        return routes;
    }

    public render(): React.ReactNode {
        return (
            <Row>
                <Col md={3}>
                    <Card>
                        <CardHeader tag="h2">
                            <FontAwesomeIcon icon={faClone} className="right-space" />
                            Available database models
                        </CardHeader>
                        <CardBody>
                            { this.state.IsLoading ? (
                                <span>Loading...</span>
                            ) : (
                                <RoutingMenu Menu={this.state.MenuModel} />
                            )}
                        </CardBody>
                    </Card>
                </Col>
                <Col md={9}>
                    <Switch>
                        <Route exact={true} path="/databases" render={() =>
                            <Card>
                                <CardHeader tag="h2">
                                    <FontAwesomeIcon icon={faComment} className="right-space" />
                                    Information
                                </CardHeader>
                                <CardBody>
                                    <span className="font-italic font-small">Configure all available database models. Please select a database model to proceed...</span>
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

export default connect<DatabasesPropsModel, DatabasesDispatchPropModel>(mapStateToProps, mapDispatchToProps)(Database);
