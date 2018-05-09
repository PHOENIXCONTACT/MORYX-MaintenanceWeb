import { faEdit } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import NotificationSystem = require("react-notification-system");
import { Button, ButtonGroup, Col, Container, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import LogRestClient from "../api/LogRestClient";
import LogLevelToCssClassConverter from "../converter/LogLevelToCssClassConverter";
import LoggerModel from "../models/LoggerModel";
import { LogLevel } from "../models/LogLevel";
import LogMessageModel from "../models/LogMessageModel";

interface ILogPropsModel {
    RestClient: LogRestClient;
    Logger: LoggerModel;
    onCloseTab: (logger: LoggerModel) => void;
}

interface ILogStateModel {
    LogMessages: LogMessageModel[];
    FilteredLogMessages: LogMessageModel[];
    AppenderId: number;
    MaxLogEntries: number;
    IntermediateMaxLogEntries: number;
    FilterLogLevel: LogLevel;
    SelectedLogMessage: LogMessageModel;
    IsLogDetailDialogOpen: boolean;
}

export default class Logger extends React.Component<ILogPropsModel, ILogStateModel> {

    private logLevelCssConverter: LogLevelToCssClassConverter;
    private updateLogMessagesTimer: number;

    constructor(props: ILogPropsModel) {
        super(props);
        this.state = {
            LogMessages: [],
            FilteredLogMessages: [],
            AppenderId: -1,
            MaxLogEntries: 20,
            IntermediateMaxLogEntries: 20,
            FilterLogLevel: LogLevel.Trace,
            SelectedLogMessage: null,
            IsLogDetailDialogOpen: false,
        };

        this.logLevelCssConverter = new LogLevelToCssClassConverter();
    }

    public componentDidMount() {
        this.props.RestClient.addRemoteAppender(this.props.Logger.Name, this.props.Logger.ActiveLevel).then((data) => {
            this.setState({ AppenderId: data.AppenderId });
            this.onUpdateLogMessages();
            this.updateLogMessagesTimer = setInterval(this.onUpdateLogMessages.bind(this), 3000);
        });
    }

    public componentWillUnmount() {
        clearInterval(this.updateLogMessagesTimer);
        this.props.RestClient.removeRemoteAppender(this.state.AppenderId);
    }

    private onUpdateLogMessages() {
        this.props.RestClient.messages(this.state.AppenderId).then((data) => this.updateLogMessages(data));
    }

    private updateLogMessages(logMessages: LogMessageModel[]) {
        logMessages.reverse();
        const newLogMessageList = logMessages.concat(this.state.LogMessages);
        this.setState({ LogMessages: newLogMessageList, FilteredLogMessages: this.applyFilter(newLogMessageList, this.state.FilterLogLevel, this.state.MaxLogEntries) });
    }

    private clearLogMessages() {
        this.setState({ LogMessages: [], FilteredLogMessages: [] });
    }

    private onFilterLogLevelChange(e: React.FormEvent<HTMLInputElement>) {
        const newValue = parseInt((e.target as HTMLSelectElement).value);
        this.setState({ FilterLogLevel: newValue, FilteredLogMessages: this.applyFilter(this.state.LogMessages, newValue, this.state.MaxLogEntries) });
    }

    private onChangeMaxEntries(e: React.FormEvent<HTMLInputElement>) {
        this.setState({ IntermediateMaxLogEntries: parseInt(e.currentTarget.value) });
    }

    private onApplyMaxEntries() {
        this.setState({ MaxLogEntries: this.state.IntermediateMaxLogEntries, FilteredLogMessages: this.applyFilter(this.state.LogMessages, this.state.FilterLogLevel, this.state.IntermediateMaxLogEntries) });
    }

    private applyFilter(logMessages: LogMessageModel[], logLevel: LogLevel, maxEntries: number) {
        return logMessages.filter((logMessage: LogMessageModel) => logMessage.LogLevel >= logLevel).slice(0, maxEntries);
    }

    private onShowLogMessageDetailed(logMessage: LogMessageModel) {
        this.setState({ SelectedLogMessage: logMessage, IsLogDetailDialogOpen: true });
    }

    private cutMessage(message: string): string {
        const lines: string[] = message.split("\n");
        let cutted = lines.length > 0 ? lines[0] : message;
        cutted = cutted.slice(0, 150);

        if (cutted.length < message.length) {
            cutted += "...";
        }

        return cutted;
    }

    private preRenderLogMessages() {
        return this.state.FilteredLogMessages.map((message, idx) =>
            <tr key={idx}
                style={{background: this.logLevelCssConverter.Convert(message.LogLevel), cursor: "pointer"}}
                onClick={this.onShowLogMessageDetailed.bind(this, message)}>
                <td>{moment(message.Timestamp).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td>{LogLevel[message.LogLevel]}</td>
                <td>{this.cutMessage(message.Message)}</td>
                <td>{message.ClassName}</td>
            </tr>,
        );
    }

    public render() {
        return (
            <div>
                <Container fluid={true}>
                    <Row style={{marginTop: "15px"}}>
                        <Col md={2} className="font-bold font-small">Filter by log level:</Col>
                        <Col md={2}>
                            <Input type="select" value={this.state.FilterLogLevel}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => this.onFilterLogLevelChange(e)}>
                                <option value={LogLevel.Trace}>Trace</option>
                                <option value={LogLevel.Debug}>Debug</option>
                                <option value={LogLevel.Info}>Info</option>
                                <option value={LogLevel.Warning}>Warning</option>
                                <option value={LogLevel.Error}>Error</option>
                                <option value={LogLevel.Fatal}>Fatal</option>
                            </Input>
                        </Col>
                        <Col md={2} className="font-bold font-small">Max. log entries:</Col>
                        <Col md={2}>
                            <Input type="text" value={this.state.IntermediateMaxLogEntries}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => this.onChangeMaxEntries(e)}
                                onBlur={this.onApplyMaxEntries.bind(this)}>
                            </Input>
                        </Col>
                        <Col md={1} />
                        <Col md={3}>
                            <ButtonGroup className="float-right">
                                <Button color="primary" onClick={this.clearLogMessages.bind(this)} disabled={this.state.LogMessages.length == 0}>Clear log messages</Button>
                                { this.props.onCloseTab != null &&
                                    <Button color="primary" onClick={() => this.props.onCloseTab(this.props.Logger)}>Close tab</Button>
                                }
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row style={{marginTop: "10px"}}>
                        <Col md={12}>
                            <Table size="sm">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Level</th>
                                        <th>Message</th>
                                        <th>Class name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.LogMessages.length != 0 && (
                                        this.preRenderLogMessages()
                                    )}
                                </tbody>
                                { this.state.LogMessages.length == 0 && (
                                        <span className="font-normal font-italic">No log messages found for this logger.</span>
                                )}
                            </Table>
                        </Col>
                    </Row>
                </Container>
                { this.state.SelectedLogMessage != null &&
                    <Modal isOpen={this.state.IsLogDetailDialogOpen} className="log-modal-dialog">
                        <ModalHeader tag="h2" style={{background: this.logLevelCssConverter.Convert(this.state.SelectedLogMessage.LogLevel)}}>
                            Log message from {moment(this.state.SelectedLogMessage.Timestamp).format("YYYY-MM-DD HH:mm:ss")} ({this.state.SelectedLogMessage.ClassName})
                        </ModalHeader>
                        <ModalBody>
                            <Container fluid={true}>
                                <Row>
                                    <Col md={12}>
                                        <pre className="font-small">{this.state.SelectedLogMessage.Message}</pre>
                                    </Col>
                                </Row>
                            </Container>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => this.setState({ SelectedLogMessage: null, IsLogDetailDialogOpen: false })}>Close</Button>
                        </ModalFooter>
                    </Modal>
                }
            </div>
        );
    }
}
