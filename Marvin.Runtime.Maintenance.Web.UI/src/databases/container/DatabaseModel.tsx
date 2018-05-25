import { faBriefcase, faCheck, faDatabase, faExclamation, faPlug, faSpinner, faTable } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import NotificationSystem = require("react-notification-system");
import { connect, Dispatch } from "react-redux";
import { Link, Route, Switch } from "react-router-dom";
import { Button, ButtonGroup, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import kbToString from "../../common/converter/ByteConverter";
import { IAppState } from "../../common/redux/AppState";
import { updateShowWaitDialog } from "../../common/redux/CommonActions";
import { ActionType } from "../../common/redux/Types";
import "../../common/scss/Theme.scss";
import DatabasesRestClient from "../api/DatabasesRestClient";
import DatabaseConfigModel from "../models/DatabaseConfigModel";
import DataModel from "../models/DataModel";
import DbMigrationsModel from "../models/DbMigrationsModel";
import ScriptModel from "../models/ScriptModel";
import SetupModel from "../models/SetupModel";
import { TestConnectionResult } from "../models/TestConnectionResult";
import { updateDatabaseConfig } from "../redux/DatabaseActions";

interface IDatabaseModelPropsModel {
    RestClient: DatabasesRestClient;
    DataModel: DataModel;
    NotificationSystem: NotificationSystem.System;
}

interface IDatabaseModelDispatchPropsModel {
    onUpdateDatabaseConfig?: (databaseConfig: DataModel) => void;
    onShowWaitDialog?: (showWaitDialog: boolean) => void;
}

const mapDispatchToProps = (dispatch: Dispatch<ActionType<{}>>): IDatabaseModelDispatchPropsModel => {
    return {
        onUpdateDatabaseConfig: (databaseConfig: DataModel) => dispatch(updateDatabaseConfig(databaseConfig)),
        onShowWaitDialog: (showWaitDialog: boolean) => dispatch(updateShowWaitDialog(showWaitDialog)),
    };
};

interface IDatabaseModelStateModel {
    activeTab: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    selectedMigration: string;
    selectedSetup: string;
    selectedScript: string;
    selectedBackup: string;
    testConnectionPending: boolean;
    testConnectionResult: TestConnectionResult;
}

class DatabaseModel extends React.Component<IDatabaseModelPropsModel & IDatabaseModelDispatchPropsModel, IDatabaseModelStateModel> {
    constructor(props: IDatabaseModelPropsModel & IDatabaseModelDispatchPropsModel) {
        super(props);
        this.state = {
            activeTab: "1",
            host: this.props.DataModel.Config.Server,
            port: this.props.DataModel.Config.Port,
            database: this.props.DataModel.Config.Database,
            username: this.props.DataModel.Config.User,
            password: this.props.DataModel.Config.Password,
            selectedMigration: (this.props.DataModel.AvailableMigrations.length != 0 ? this.props.DataModel.AvailableMigrations[0].Name : ""),
            selectedSetup : (this.props.DataModel.Setups.length != 0 ? this.props.DataModel.Setups[0].Name : ""),
            selectedScript : (this.props.DataModel.Scripts.length != 0 ? this.props.DataModel.Scripts[0].Name : ""),
            selectedBackup : (this.props.DataModel.Backups.length != 0 ? this.props.DataModel.Backups[0].FileName : ""),
            testConnectionPending: false,
            testConnectionResult: TestConnectionResult.ConfigurationError,
        };
    }

    public componentDidMount() {
        this.onTestConnection();
    }

    public createConfigModel(): DatabaseConfigModel {
        return {
            Server: this.state.host,
            Port: this.state.port,
            Database: this.state.database,
            User: this.state.username,
            Password: this.state.password,
        };
    }

    public activeTab(tabId: string) {
        this.setState({activeTab: tabId});
    }

    public onSelectMigration(e: React.FormEvent<HTMLInputElement>) {
        this.setState({selectedMigration: (e.target as HTMLSelectElement).value});
    }

    public onSelectSetup(e: React.FormEvent<HTMLInputElement>) {
        this.setState({selectedSetup: (e.target as HTMLSelectElement).value});
    }

    public onSelectScript(e: React.FormEvent<HTMLInputElement>) {
        this.setState({selectedScript: (e.target as HTMLSelectElement).value});
    }

    public onSelectBackup(e: React.FormEvent<HTMLInputElement>) {
        this.setState({selectedBackup: (e.target as HTMLSelectElement).value});
    }

    public onChangeHost(e: React.FormEvent<HTMLInputElement>) {
        this.setState({host: (e.target as HTMLInputElement).value});
    }

    public onChangePort(e: React.FormEvent<HTMLInputElement>) {
        this.setState({port: parseInt((e.target as HTMLInputElement).value)});
    }

    public onChangeDatabase(e: React.FormEvent<HTMLInputElement>) {
        this.setState({database: (e.target as HTMLInputElement).value});
    }

    public onChangeUsername(e: React.FormEvent<HTMLInputElement>) {
        this.setState({username: (e.target as HTMLInputElement).value});
    }

    public onChangePassword(e: React.FormEvent<HTMLInputElement>) {
        this.setState({password: (e.target as HTMLInputElement).value});
    }

    public onSave() {
        this.props.onShowWaitDialog(true);

        this.props.RestClient.saveDatabaseConfig(this.createConfigModel(), this.props.DataModel.TargetModel).then(() => {
            this.props.onShowWaitDialog(false);

            this.props.RestClient.databaseModel(this.props.DataModel.TargetModel).then((data) => this.props.onUpdateDatabaseConfig(data));
            this.props.NotificationSystem.addNotification({ title: "Configuration saved", message: "", level: "success", autoDismiss: 5 });
        }).catch((d) => this.props.onShowWaitDialog(false));
    }

    public onTestConnection() {
        this.setState({ testConnectionPending: true });
        this.props.RestClient.testDatabaseConfig(this.createConfigModel(), this.props.DataModel.TargetModel)
                             .then((response) => this.setState({ testConnectionPending: false,
                                                                 testConnectionResult: response.Result,
                     }));
    }

    public onCreateDatabase() {
        this.props.onShowWaitDialog(true);

        this.props.RestClient.createDatabase(this.createConfigModel(), this.props.DataModel.TargetModel).then((data) => {
            this.props.onShowWaitDialog(false);

            if (data.Success) {
                this.props.RestClient.databaseModel(this.props.DataModel.TargetModel).then((data) => this.props.onUpdateDatabaseConfig(data));
                this.props.NotificationSystem.addNotification({ title: "Success", message: "Database created successfully", level: "success", autoDismiss: 5 });
           } else {
                this.props.NotificationSystem.addNotification({ title: "Error", message: "Database not created: " + data.ErrorMessage, level: "error", autoDismiss: 5 });
           }
            this.onTestConnection();
        }).catch((d) => this.props.onShowWaitDialog(false));
    }

    public onEraseDatabase() {
        this.props.onShowWaitDialog(true);

        this.props.RestClient.eraseDatabase(this.createConfigModel(), this.props.DataModel.TargetModel).then((data) => {
            this.props.onShowWaitDialog(false);

            if (data.Success) {
                this.props.RestClient.databaseModel(this.props.DataModel.TargetModel).then((data) => this.props.onUpdateDatabaseConfig(data));
                this.props.NotificationSystem.addNotification({ title: "Success", message: "Database deleted successfully", level: "success", autoDismiss: 5 });
            } else {
                this.props.NotificationSystem.addNotification({ title: "Error", message: "Database not deleted: " + data.ErrorMessage, level: "error", autoDismiss: 5 });
            }
            this.onTestConnection();
        }).catch((d) => this.props.onShowWaitDialog(false));
    }

    public onExecuteDump() {
        this.props.onShowWaitDialog(true);

        this.props.RestClient.dumpDatabase(this.createConfigModel(), this.props.DataModel.TargetModel).then((data) => {
            this.props.onShowWaitDialog(false);

            if (data.Success) {
                this.props.NotificationSystem.addNotification({ title: "Success", message: "Database dump started successfully. Please refer to the log to get information about the progress.", level: "success", autoDismiss: 5 });
            } else {
                this.props.NotificationSystem.addNotification({ title: "Error", message: "Dump start failed: " + data.ErrorMessage, level: "error", autoDismiss: 5 });
            }
        }).catch((d) => this.props.onShowWaitDialog(false));
    }

    public onExecuteRestore() {
        this.props.onShowWaitDialog(true);

        this.props.RestClient.restoreDatabase({ Config: this.createConfigModel(), BackupFileName: this.state.selectedBackup }, this.props.DataModel.TargetModel).then((data) => {
            this.props.onShowWaitDialog(false);

            if (data.Success) {
                this.props.NotificationSystem.addNotification({ title: "Success", message: "Database restore started successfully. Please refer to the log to get information about the progress.", level: "success", autoDismiss: 5 });
            } else {
                this.props.NotificationSystem.addNotification({ title: "Error", message: "Restore start failed: " + data.ErrorMessage, level: "error", autoDismiss: 5 });
            }
        }).catch((d) => this.props.onShowWaitDialog(false));
    }

    public onApplyMigration() {
        this.props.onShowWaitDialog(true);

        this.props.RestClient.applyMigration(this.props.DataModel.TargetModel, this.state.selectedMigration, this.createConfigModel()).then((data) => {
            this.props.onShowWaitDialog(false);

            if (data.WasUpdated) {
                this.props.RestClient.databaseModel(this.props.DataModel.TargetModel).then((data) => this.props.onUpdateDatabaseConfig(data));
                this.props.NotificationSystem.addNotification({ title: "Success", message: "Migration applied", level: "success", autoDismiss: 5 });
            } else {
                this.props.NotificationSystem.addNotification({ title: "Error", message: "Migration not applied", level: "error", autoDismiss: 5 });
            }
        }).catch((d) => this.props.onShowWaitDialog(false));
    }

    public onRollbackDatabase() {
        this.props.onShowWaitDialog(true);

        this.props.RestClient.rollbackDatabase(this.props.DataModel.TargetModel, this.createConfigModel()).then((data) => {
            this.props.onShowWaitDialog(false);

            if (data.Success) {
                this.props.RestClient.databaseModel(this.props.DataModel.TargetModel).then((data) => this.props.onUpdateDatabaseConfig(data));
                this.props.NotificationSystem.addNotification({ title: "Success", message: "Database rollback completed successfully", level: "success", autoDismiss: 5 });
            } else {
                this.props.NotificationSystem.addNotification({ title: "Error", message: "Database rollback failed: " + data.ErrorMessage, level: "error", autoDismiss: 5 });
            }
        }).catch((d) => this.props.onShowWaitDialog(false));
    }

    public onExecuteSetup() {
        this.props.onShowWaitDialog(true);

        this.props.RestClient.executeSetup(this.props.DataModel.TargetModel, { Config: this.createConfigModel(), Setup: this.props.DataModel.Setups.find((setup: SetupModel) => setup.Name == this.state.selectedSetup) }).then((data) => {
            this.props.onShowWaitDialog(false);

            if (data.Success) {
                this.props.NotificationSystem.addNotification({ title: "Success", message: "Setup '" + this.state.selectedSetup + "' executed successfully", level: "success", autoDismiss: 5 });
            } else {
                this.props.NotificationSystem.addNotification({ title: "Error", message: data.ErrorMessage, level: "error", autoDismiss: 5 });
            }
        }).catch((d) => this.props.onShowWaitDialog(false));
    }

    public onExecuteScript() {
        this.props.onShowWaitDialog(true);

        this.props.RestClient.executeScript(this.props.DataModel.TargetModel, { Config: this.createConfigModel(), Script: this.props.DataModel.Scripts.find((script: ScriptModel) => script.Name == this.state.selectedScript) }).then((data) => {
            this.props.onShowWaitDialog(false);

            if (data.Success) {
                this.props.NotificationSystem.addNotification({ title: "Success", message: "Script '" + this.state.selectedScript + "' executed successfully", level: "success", autoDismiss: 5 });
            } else {
                this.props.NotificationSystem.addNotification({ title: "Error", message: data.ErrorMessage, level: "error", autoDismiss: 5 });
            }
        }).catch((d) => this.props.onShowWaitDialog(false));
    }

    private preRenderConnectionCheckIcon() {
        switch (this.state.testConnectionResult) {
            case TestConnectionResult.Success:
                return (<FontAwesomeIcon icon={faCheck} style={{color: "green"}} />);
            case TestConnectionResult.ConfigurationError:
                return (<div style={{display: "inline", color: "red"}} id="TestConnectionErrorHint">
                            <FontAwesomeIcon icon={faExclamation} className="right-space" />
                            <FontAwesomeIcon icon={faTable} />
                            <UncontrolledTooltip placement="right" target="TestConnectionErrorHint">
                                Please check if model configuration exists on server.
                            </UncontrolledTooltip>
                        </div>);
            case TestConnectionResult.ConnectionError:
                return (<div style={{display: "inline", color: "red"}} id="TestConnectionErrorHint">
                            <FontAwesomeIcon icon={faExclamation} className="right-space" />
                            <FontAwesomeIcon icon={faPlug} />
                            <UncontrolledTooltip placement="right" target="TestConnectionErrorHint">
                                Please check host, port and credentials.
                            </UncontrolledTooltip>
                        </div>);
            case TestConnectionResult.ConnectionOkDbDoesNotExist:
                return (<div style={{display: "inline", color: "red"}} id="TestConnectionErrorHint">
                        <FontAwesomeIcon icon={faExclamation} className="right-space" />
                        <FontAwesomeIcon icon={faDatabase} />
                        <UncontrolledTooltip placement="right" target="TestConnectionErrorHint">
                            The connection to the database could be established but the database could not be found. Please check the name of the database or create it before.
                        </UncontrolledTooltip>
                    </div>);
        }
    }

    public render() {
        return (
            <Card>
                <CardHeader tag="h2">
                    <FontAwesomeIcon icon={faBriefcase} className="right-space" />
                    {this.props.DataModel.TargetModel}
                </CardHeader>
                <CardBody>
                    <Container fluid={true}>
                        <Row>
                            <Col md={6}>
                                <h3>
                                    <span className="right-space">Connection</span>
                                    { this.state.testConnectionPending ? (
                                        <FontAwesomeIcon icon={faSpinner} spin={true} />
                                    ) : this.preRenderConnectionCheckIcon() }
                                </h3>
                            </Col>
                            <Col md={6}>
                                <h3>Backup &amp; Restore</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Container fluid={true}>
                                    <Row>
                                        <Col md={12}>
                                            <Form inline={true}>
                                                <Input placeholder={"Host"} value={this.state.host} onChange={(e: React.FormEvent<HTMLInputElement>) => this.onChangeHost(e)} onBlur={this.onTestConnection.bind(this)} style={{width: "78%"}} />
                                                <span className="center-text" style={{width: "2%"}}>:</span>
                                                <Input placeholder={"Port"} value={this.state.port} onChange={(e: React.FormEvent<HTMLInputElement>) => this.onChangePort(e)} onBlur={this.onTestConnection.bind(this)} style={{width: "20%"}} />
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row className="up-space">
                                        <Col md={12}><Input placeholder={"Name of database"} value={this.state.database} onChange={(e: React.FormEvent<HTMLInputElement>) => this.onChangeDatabase(e)} onBlur={this.onTestConnection.bind(this)} /></Col>
                                    </Row>
                                    <Row className="up-space">
                                        <Col md={12}><Input placeholder={"Username"} value={this.state.username} onChange={(e: React.FormEvent<HTMLInputElement>) => this.onChangeUsername(e)} onBlur={this.onTestConnection.bind(this)} /></Col>
                                    </Row>
                                    <Row className="up-space">
                                        <Col md={12}><Input placeholder={"Password"} value={this.state.password} onChange={(e: React.FormEvent<HTMLInputElement>) => this.onChangePassword(e)} onBlur={this.onTestConnection.bind(this)} /></Col>
                                    </Row>
                                    <Row className="up-space-lg">
                                        <Col md={12}>
                                            <Button color="primary" onClick={() => this.onSave()}>Save</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                            <Col md={6}>
                                <Container fluid={true}>
                                    <Row>
                                        <Col md={12}>
                                            <Input type="select" size={5} className="auto-height"
                                                onChange={(e: React.FormEvent<HTMLInputElement>) => this.onSelectBackup(e)}>
                                            {
                                                this.props.DataModel.Backups.map((backup, idx) => {
                                                    return (<option key={idx} value={backup.FileName}>{backup.FileName + " (Size: " + kbToString(backup.Size * 1024) + ", Created on: " + moment(backup.CreationDate).format("YYYY-MM-DD HH:mm:ss") + ")"}</option>);
                                                })
                                            }
                                            </Input>
                                        </Col>
                                    </Row>
                                    <Row className="up-space-lg">
                                        <Col md={12}>
                                            <ButtonGroup>
                                                <Button color="primary"
                                                        disabled={this.state.testConnectionResult != TestConnectionResult.Success}
                                                        onClick={this.onExecuteDump.bind(this)}>
                                                    Create a backup
                                                </Button>
                                                <Button color="primary"
                                                        disabled={this.state.selectedBackup == "" || this.state.testConnectionResult != TestConnectionResult.Success}
                                                        onClick={this.onExecuteRestore.bind(this)}>
                                                    Restore selected backup
                                                </Button>
                                            </ButtonGroup>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                        <Row className="up-space-lg">
                            <Col md={6}>
                                <h3>Migration &amp; Setup</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <ButtonGroup>
                                    <Button color="primary"
                                            onClick={() => this.onCreateDatabase()}
                                            disabled={this.state.testConnectionResult != TestConnectionResult.ConnectionOkDbDoesNotExist}>
                                        Create database
                                    </Button>
                                    <Button color="primary"
                                            onClick={() => this.onEraseDatabase()}
                                            disabled={this.state.testConnectionResult != TestConnectionResult.Success}>
                                        Erase database
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row className="up-space-lg">
                            <Col md={12}>
                                <Nav tabs={true}>
                                    <NavItem>
                                        <NavLink active={this.state.activeTab == "1"} onClick={() => { this.activeTab("1"); }}>Migrations</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink active={this.state.activeTab == "2"} onClick={() => { this.activeTab("2"); }}>Setups</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink active={this.state.activeTab == "3"} onClick={() => { this.activeTab("3"); }}>Scripts</NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
                                        { this.props.DataModel.AvailableMigrations.length != 0 ?
                                            (
                                            <Container fluid={true}>
                                                <Row>
                                                    <Col md={12}>
                                                        <Input type="select" size={10} className="auto-height"
                                                            onChange={(e: React.FormEvent<HTMLInputElement>) => this.onSelectMigration(e)}>
                                                        {
                                                            this.props.DataModel.AvailableMigrations.map((migration, idx) => {
                                                                const installed = this.props.DataModel.AppliedMigrations.find((installedMigration: DbMigrationsModel) => installedMigration.Name == migration.Name);
                                                                const option = migration.Name + " (" + (installed ? "Installed" : "Not installed") + ")";

                                                                return (<option key={idx} value={migration.Name}>{option}</option>);
                                                            })
                                                        }
                                                        </Input>
                                                    </Col>
                                                </Row>
                                                <Row className="up-space-lg">
                                                    <Col md={12}>
                                                        <ButtonGroup>
                                                            <Button color="primary"
                                                                    onClick={() => this.onApplyMigration()}
                                                                    disabled={this.state.selectedMigration == "" || this.state.testConnectionResult != TestConnectionResult.Success}>
                                                                Apply selected migration
                                                            </Button>
                                                            <Button color="primary"
                                                                    onClick={() => this.onRollbackDatabase()}
                                                                    disabled={this.props.DataModel.AvailableMigrations.length == 0 || this.state.testConnectionResult != TestConnectionResult.Success}>
                                                                Rollback all migrations
                                                            </Button>
                                                        </ButtonGroup>
                                                    </Col>
                                                </Row>
                                            </Container>
                                            ) : (
                                                <Row>
                                                    <Col>
                                                        <span className="font-italic">No migrations found.</span>
                                                    </Col>
                                                </Row>
                                            )}
                                    </TabPane>
                                    <TabPane tabId="2">
                                        { this.props.DataModel.Setups.length != 0 ?
                                            (
                                            <Container fluid={true}>
                                                <Row>
                                                    <Col md={12}>
                                                        <Input type="select" size={10} className="auto-height"
                                                            onChange={(e: React.FormEvent<HTMLInputElement>) => this.onSelectSetup(e)}>
                                                        {
                                                            this.props.DataModel.Setups.map((setup, idx) => {
                                                                return (<option key={idx} value={setup.Name}>{setup.Name} - {setup.Description}</option>);
                                                            })
                                                        }
                                                        </Input>
                                                    </Col>
                                                </Row>
                                                <Row className="up-space-lg">
                                                    <Col md={12}>
                                                        <Button color="primary"
                                                                onClick={() => this.onExecuteSetup()}
                                                                disabled={this.state.selectedSetup == "" || this.state.testConnectionResult != TestConnectionResult.Success}>
                                                            Execute setup
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                            ) : (
                                                <Row>
                                                    <Col>
                                                        <span className="font-italic">No setups found.</span>
                                                    </Col>
                                                </Row>
                                            )}
                                    </TabPane>
                                    <TabPane tabId="3">
                                        { this.props.DataModel.Scripts.length != 0 ?
                                            (
                                            <Container fluid={true}>
                                                <Row>
                                                    <Col md={12}>
                                                        <Input type="select" size={10} className="auto-height"
                                                            onChange={(e: React.FormEvent<HTMLInputElement>) => this.onSelectScript(e)}>
                                                        {
                                                            this.props.DataModel.Scripts.map((script, idx) => {
                                                                return (<option key={idx} value={script.Name}>{script.Name + (script.IsCreationScript ? " (IsCreationScript)" : "")}</option>);
                                                            })
                                                        }
                                                        </Input>
                                                    </Col>
                                                </Row>
                                                <Row className="up-space-lg">
                                                    <Col md={12}>
                                                        <Button color="primary"
                                                                onClick={() => this.onExecuteScript()}
                                                                disabled={this.state.selectedScript == "" || this.state.testConnectionResult != TestConnectionResult.Success}>
                                                            Execute script
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                            ) : (
                                                <Row>
                                                    <Col>
                                                        <span className="font-italic">No scripts found.</span>
                                                    </Col>
                                                </Row>
                                            )}
                                    </TabPane>
                                </TabContent>
                            </Col>
                        </Row>
                    </Container>
                </CardBody>
            </Card>
        );
    }
}

export default connect<{}, IDatabaseModelDispatchPropsModel>(null, mapDispatchToProps)(DatabaseModel);
