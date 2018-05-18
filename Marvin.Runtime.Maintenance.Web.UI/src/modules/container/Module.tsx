import { faCheck, faHospital, faPlay, faSquare, faStop } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card, CardBody, CardHeader, Col, Container, Input, Row, Table } from "reactstrap";
import { ActionType } from "../../common/redux/Types";
import { HealthStateBadge } from "../../dashboard/components/HealthStateBadge";
import ModulesRestClient from "../api/ModulesRestClient";
import { FailureBehaviour } from "../models/FailureBehaviour";
import { ModuleNotificationType } from "../models/ModuleNotificationType";
import { ModuleStartBehaviour } from "../models/ModuleStartBehaviour";
import ServerModuleModel from "../models/ServerModuleModel";
import { updateFailureBehaviour, updateStartBehaviour } from "../redux/ModulesActions";

interface IModulePropModel {
    RestClient?: ModulesRestClient;
    Module: ServerModuleModel;
}

interface IModuleStateModel {
    HasWarnings: boolean;
}

interface IModuleDispatchPropModel {
    onUpdateStartBehaviour?: (moduleName: string, startBehaviour: ModuleStartBehaviour) => void;
    onUpdateFailureBehaviour?: (moduleName: string, failureBehaviour: FailureBehaviour) => void;
}

const mapDispatchToProps = (dispatch: Dispatch<ActionType<{}>>): IModuleDispatchPropModel => {
    return {
        onUpdateStartBehaviour: (moduleName: string, startBehaviour: ModuleStartBehaviour) => dispatch(updateStartBehaviour(moduleName, startBehaviour)),
        onUpdateFailureBehaviour: (moduleName: string, failureBehaviour: FailureBehaviour) => dispatch(updateFailureBehaviour(moduleName, failureBehaviour)),
    };
};

class Module extends React.Component<IModulePropModel & IModuleDispatchPropModel, IModuleStateModel> {
    constructor(props: IModulePropModel & IModuleDispatchPropModel) {
        super(props);

        this.state = { HasWarnings: false };
    }

    public componentWillReceiveProps(nextProps: IModulePropModel) {
        const warnings = nextProps.Module.Notifications.filter(function(element, index, array) { return element.NotificationType == ModuleNotificationType.Warning; });
        this.setState({ HasWarnings: warnings.length != 0 });
    }

    public preRenderModuleDependencyRows(dependencies: ServerModuleModel[]) {
        return dependencies.map((module, idx) =>
        <tr>
            <td>{module.Name}</td>
            <td><HealthStateBadge HealthState={module.HealthState} /></td>
        </tr>);
    }

    public startModule() {
        this.props.RestClient.startModule(this.props.Module.Name);
    }

    public stopModule() {
        this.props.RestClient.stopModule(this.props.Module.Name);
    }

    public reincarnateModule() {
        this.props.RestClient.reincarnateModule(this.props.Module.Name);
    }

    public confirmModuleWarning() {
        this.props.RestClient.confirmModuleWarning(this.props.Module.Name);
    }

    public onStartBehaviourChange(e: React.FormEvent<HTMLInputElement>) {
        const newValue = parseInt((e.target as HTMLSelectElement).value);
        this.props.RestClient.updateModule({ ...this.props.Module, StartBehaviour: newValue }).then((d) => this.props.onUpdateStartBehaviour(this.props.Module.Name, newValue));
    }

    public onFailureBehaviourChange(e: React.FormEvent<HTMLInputElement>) {
        const newValue = parseInt((e.target as HTMLSelectElement).value);
        this.props.RestClient.updateModule({ ...this.props.Module, FailureBehaviour: newValue }).then((d) => this.props.onUpdateFailureBehaviour(this.props.Module.Name, newValue));
    }

    public render() {
        return (
            <Card>
                <CardHeader tag="h2">
                    <FontAwesomeIcon icon={faSquare} className="right-space" />
                    {this.props.Module.Name} - General
                </CardHeader>
                <CardBody>
                    <Container fluid={true}>
                        <Row>
                            <Col md={6}>
                                <h3>Control</h3>
                                <ButtonGroup>
                                    <Button color="primary" onClick={this.startModule.bind(this)}><FontAwesomeIcon icon={faPlay} className="right-space" />Start</Button>
                                    <Button color="primary" onClick={this.stopModule.bind(this)}><FontAwesomeIcon icon={faStop} className="right-space" />Stop</Button>
                                    <Button color="primary" onClick={this.reincarnateModule.bind(this)}><FontAwesomeIcon icon={faHospital} className="right-space" />Reincarnate</Button>
                                </ButtonGroup>
                            </Col>
                            <Col md={6}>
                                <h3>Error Handling</h3>
                                {this.state.HasWarnings ? (
                                    <Button color="warning" onClick={this.confirmModuleWarning.bind(this)}><FontAwesomeIcon icon={faCheck} className="right-space" />Confirm warnings</Button>
                                ) : (
                                    <span className="font-italic font-small">No warnings.</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="up-space-lg">
                            <Col md={6}>
                                <h3>General Information</h3>
                                <Container fluid={true}>
                                    <Row>
                                        <Col md={4}><span className="font-bold font-small">Name:</span></Col>
                                        <Col md={8}><span className="font-small font-italic">{this.props.Module.Name}</span></Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}><span className="font-bold font-small">Bundle:</span></Col>
                                        <Col md={8}><span className="font-small font-italic">{this.props.Module.Assembly.Bundle}</span></Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}><span className="font-bold font-small">State:</span></Col>
                                        <Col md={8}><span className="font-small"><HealthStateBadge HealthState={this.props.Module.HealthState} /></span></Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}><span className="font-bold font-small">Assembly:</span></Col>
                                        <Col md={8}><span className="font-small font-italic">{this.props.Module.Assembly.Name}</span></Col>
                                    </Row>
                                </Container>
                            </Col>
                            <Col md={6}>
                                <h3>Dependencies</h3>
                                {this.props.Module.Dependencies.length == 0 ? (
                                    <span className="font-italic font-small">This module has no dependencies.</span>
                                ) : (
                                    <Table striped={true}>
                                        <thead>
                                            <tr>
                                                <th>Module Name</th>
                                                <th>State</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.props.Module.Dependencies.map((module, idx) =>
                                                <tr key={idx}>
                                                    <td><Link to={"/modules/" + module.Name}>{module.Name}</Link></td>
                                                    <td><HealthStateBadge HealthState={module.HealthState} /></td>
                                                </tr>)
                                            }
                                        </tbody>
                                    </Table>
                                )}
                            </Col>
                        </Row>
                        <Row className="up-space-lg">
                            <Col md={6}>
                                <h3>Start &amp; Failure behaviour</h3>
                                <Container fluid={true}>
                                    <Row>
                                        <Col md={4}><span className="font-bold font-small center-text">Start behaviour:</span></Col>
                                        <Col md={8}>
                                            <Input type="select" value={this.props.Module.StartBehaviour}
                                                   onChange={(e: React.FormEvent<HTMLInputElement>) => this.onStartBehaviourChange(e)}>
                                                <option value={ModuleStartBehaviour.Auto}>Auto</option>
                                                <option value={ModuleStartBehaviour.Manual}>Manual</option>
                                                <option value={ModuleStartBehaviour.OnDependency}>On dependency</option>
                                            </Input>
                                        </Col>
                                    </Row>
                                    <Row className="up-space">
                                        <Col md={4}><span className="font-bold font-small center-text">Failure behaviour:</span></Col>
                                        <Col md={8}>
                                            <Input type="select" value={this.props.Module.FailureBehaviour}
                                                   onChange={(e: React.FormEvent<HTMLInputElement>) => this.onFailureBehaviourChange(e)}>
                                                <option value={FailureBehaviour.Stop}>Stop</option>
                                                <option value={FailureBehaviour.StopAndNotify}>Stop and notify</option>
                                                <option value={FailureBehaviour.Reincarnate}>Reincarnate</option>
                                                <option value={FailureBehaviour.ReincarnateAndNotify}>Reincarnate and notify</option>
                                            </Input>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                        <Row className="up-space-lg">
                            <Col md={12}>
                                <h3>Notifications</h3>
                                {this.props.Module.Notifications.length == 0 ? (
                                    <span className="font-italic font-small">No notifications detected.</span>
                                ) : (
                                <Table striped={true}>
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Message</th>
                                            <th>Level</th>
                                            <th>Stack trace</th>
                                            <th>Inner exception message</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.Module.Notifications.map((notification, idx) =>
                                            <tr key={idx}>
                                                <td>{notification.Exception.ExceptionTypeName}</td>
                                                <td>{notification.Exception.Message}</td>
                                                <td>{notification.NotificationType}</td>
                                                <td>{notification.Exception.StackTrace}</td>
                                                <td>{notification.Exception.InnerException != null ? notification.Exception.InnerException.Message : "No inner exception"}</td>
                                                <td>{notification.Timestamp}</td>
                                            </tr>)
                                        }
                                    </tbody>
                                </Table>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </CardBody>
            </Card>
        );
    }
}

export default connect<{}, IModuleDispatchPropModel>(null, mapDispatchToProps)(Module);
