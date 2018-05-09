import { faEdit, faList } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Location, UnregisterCallback } from "history";
import * as React from "react";
import NotificationSystem = require("react-notification-system");
import { connect, Dispatch } from "react-redux";
import { Link, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import TreeMenu from "../../common/components/Menu/TreeMenu";
import IMenuModel from "../../common/models/IMenuModel";
import { IAppState } from "../../common/redux/AppState";
import { ActionType } from "../../common/redux/Types";
import LogRestClient from "../api/LogRestClient";
import Logger from "../components/Logger";
import ILogMenuItem from "../models/ILogMenuItem";
import LoggerModel from "../models/LoggerModel";
import { LogLevel } from "../models/LogLevel";
import { updateLoggers } from "../redux/LogActions";

interface ILogPropsModel {
    RestClient?: LogRestClient;
    Loggers?: LoggerModel[];
    NotificationSystem?: NotificationSystem.System;
}

interface ILogDispatchPropModel {
    onUpdateLoggers?: (loggers: LoggerModel[]) => void;
}

const mapStateToProps = (state: IAppState): ILogPropsModel => {
    return {
        RestClient: state.Log.RestClient,
        Loggers: state.Log.Loggers,
        NotificationSystem: state.Common.NotificationSystem,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ActionType<{}>>): ILogDispatchPropModel => {
    return {
        onUpdateLoggers: (loggers: LoggerModel[]) => dispatch(updateLoggers(loggers)),
    };
};

interface ILogStateModel {
    ActiveTab: string;
    Menu: IMenuModel;
    LoggerTabs: LoggerModel[];
}

class Log extends React.Component<ILogPropsModel & ILogDispatchPropModel, ILogStateModel> {

    public overviewLogger: LoggerModel;

    constructor(props: ILogPropsModel & ILogDispatchPropModel) {
        super(props);
        this.state = { ActiveTab: "0", Menu: { MenuItems: [] }, LoggerTabs: [] };

        this.overviewLogger = new LoggerModel();
        this.overviewLogger.Name = "";
    }

    public componentDidMount() {
        this.props.RestClient.loggers().then((data) => {
            this.props.onUpdateLoggers(data);
            this.setState({Menu: { MenuItems: data.map((logger, idx) => this.createMenuItem(logger)) } });
        });
    }

    public createMenuItem(logger: LoggerModel): ILogMenuItem {
        const menuItem: ILogMenuItem = {
                Name: this.shortLoggerName(logger),
                NavPath: "/log",
                Icon: faList,
                Logger: logger,
                SubMenuItems: logger.ChildLogger.map((childLogger, idx) => this.createMenuItem(childLogger)),
            };

        menuItem.Content = (<span className="font-small" style={{float: "right"}}>{this.preRenderActiveLogLevel(menuItem)}</span>);
        return menuItem;
    }

    public preRenderActiveLogLevel(menuItem: ILogMenuItem) {
        return (
            <Input type="select" className="font-bold"
                   style={{width: "100%", height: "1.5rem !important", fontSize: "10px", padding: "2px"}}
                   value={menuItem.Logger.ActiveLevel}
                   onChange={(e: React.FormEvent<HTMLInputElement>) => this.onActiveLogLevelChange(e, menuItem.Logger)}>
                        <option value={LogLevel.Trace}>Trace</option>
                        <option value={LogLevel.Debug}>Debug</option>
                        <option value={LogLevel.Info}>Info</option>
                        <option value={LogLevel.Warning}>Warning</option>
                        <option value={LogLevel.Error}>Error</option>
                        <option value={LogLevel.Fatal}>Fatal</option>
            </Input>);
    }

    private onActiveLogLevelChange(e: React.FormEvent<HTMLInputElement>, logger: LoggerModel) {
        e.preventDefault();

        const newValue = parseInt((e.target as HTMLSelectElement).value);
        this.props.RestClient.logLevel(logger.Name, newValue).then((data) => {
            if (data.Success) {
                this.props.NotificationSystem.addNotification({ title: "Success", message: "Log level for '" + logger.Name +  "' was set successfully", level: "success", autoDismiss: 5 });
            } else {
                this.props.NotificationSystem.addNotification({ title: "Error", message: data.ErrorMessage, level: "error", autoDismiss: 5 });
            }
        });
        logger.ActiveLevel = newValue;

        this.forceUpdate();
    }

    private toggleTab(tabName: string) {
        this.setState({ActiveTab: tabName});
    }

    private shortLoggerName(logger: LoggerModel) {
        const splittedLoggerPath = logger.Name.split(".");
        return splittedLoggerPath[splittedLoggerPath.length - 1];
    }

    private onMenuItemClicked(menuItem: ILogMenuItem) {
       const idx = this.state.LoggerTabs.indexOf(menuItem.Logger);
       if (idx == -1) {
            this.setState((prevState) => ({
                LoggerTabs: [...prevState.LoggerTabs, menuItem.Logger],
                ActiveTab: (prevState.LoggerTabs.length + 1).toString(),
            }));
       } else {
            this.setState({ ActiveTab: (idx + 1).toString() });
       }
    }

    private onCloseTab(logger: LoggerModel) {
        const idx = this.state.LoggerTabs.indexOf(logger);
        if (idx != -1) {
            let activeTab = parseInt(this.state.ActiveTab);
            if (activeTab >= this.state.LoggerTabs.length) {
                activeTab -= 1;
            }

            this.setState((prevState) => ({
                LoggerTabs: prevState.LoggerTabs.filter((_, i) => i !== idx),
                ActiveTab: (activeTab).toString(),
            }));
        }
    }

    private preRenderNavForTabs() {
        return this.state.LoggerTabs.map((logger, idx) =>
            <NavItem key={idx}>
                <NavLink className={this.state.ActiveTab == (idx + 1).toString() ? "active" : ""} onClick={() => { this.toggleTab((idx + 1).toString()); }}>
                    {this.shortLoggerName(logger)}
                </NavLink>
            </NavItem>,
        );
    }

    private preRenderTabs() {
        return this.state.LoggerTabs.map((logger, idx) =>
            <TabPane key={idx} tabId={(idx + 1).toString()}>
                <Row>
                    <Col md="12">
                        <Logger RestClient={this.props.RestClient} Logger={logger} onCloseTab={this.onCloseTab.bind(this)} />
                    </Col>
                </Row>
            </TabPane>,
        );
    }

    public render() {
        return (
            <Row>
                <Col md={3}>
                    <Card>
                        <CardHeader tag="h2">
                            <FontAwesomeIcon icon={faList} className="right-space" />
                            Loggers
                        </CardHeader>
                        <CardBody>
                            <Container fluid={true}>
                                <TreeMenu Menu={this.state.Menu} onActiveMenuItemChanged={this.onMenuItemClicked.bind(this)} />
                            </Container>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={9}>
                    <Card>
                        <CardHeader tag="h2">
                            <FontAwesomeIcon icon={faEdit} className="right-space" />
                            Log
                        </CardHeader>
                        <CardBody>
                            <Nav tabs={true}>
                                <NavItem>
                                    <NavLink className={this.state.ActiveTab == "0" ? "active" : ""} onClick={() => { this.toggleTab("0"); }}>
                                        Overview
                                    </NavLink>
                                </NavItem>
                                {this.preRenderNavForTabs()}
                            </Nav>
                            <TabContent activeTab={this.state.ActiveTab}>
                                <TabPane tabId="0">
                                    <Row>
                                        <Col md="12">
                                            <Logger RestClient={this.props.RestClient} Logger={this.overviewLogger} onCloseTab={null} />
                                        </Col>
                                    </Row>
                                </TabPane>
                                {this.preRenderTabs()}
                            </TabContent>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default connect<ILogPropsModel, ILogDispatchPropModel>(mapStateToProps, mapDispatchToProps)(Log);
