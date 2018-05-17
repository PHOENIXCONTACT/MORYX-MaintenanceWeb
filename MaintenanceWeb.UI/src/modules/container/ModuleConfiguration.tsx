import { faCogs, faSave, faSync, faUndo } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import * as Notifications from "react-notification-system";
import { Button, ButtonGroup, Card, CardBody, CardHeader, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Row, Table } from "reactstrap";
import ModulesRestClient from "../api/ModulesRestClient";
import ConfigEditor from "../components/ConfigEditor/ConfigEditor";
import Config from "../models/Config";
import { ConfigUpdateMode } from "../models/ConfigUpdateMode";
import Entry from "../models/Entry";
import { EntryValueType, toString } from "../models/EntryValueType";

interface IModuleConfigurationPropModel {
    RestClient?: ModulesRestClient;
    ModuleName: string;
}

interface IModuleConfigurationStateModel {
    ModuleConfig: Config;
    ConfigIsLoading: boolean;
    ParentEntry: Entry;
    CurrentSubEntries: Entry[];
    EntryChain: Entry[];
}

export class ModuleConfiguration extends React.Component<IModuleConfigurationPropModel, IModuleConfigurationStateModel> {
    constructor(props: IModuleConfigurationPropModel) {
        super(props);

        this.state = {
            ModuleConfig: { Module: this.props.ModuleName, Entries: [] },
            ConfigIsLoading: true,
            ParentEntry: null,
            CurrentSubEntries: [],
            EntryChain: [],
        };

        this.navigateToEntry = this.navigateToEntry.bind(this);
    }

    public componentDidMount() {
        this.loadConfig();
    }

    public loadConfig() {
        this.props.RestClient.moduleConfig(this.props.ModuleName)
                             .then((data) => this.setState(
                                {
                                    ModuleConfig: data,
                                    ParentEntry: null,
                                    CurrentSubEntries: data.Entries,
                                    ConfigIsLoading: false,
                                    EntryChain: [],
                                }));
    }

    public onApply() {
        this.props.RestClient.saveModuleConfig(this.props.ModuleName, { Config: this.state.ModuleConfig, UpdateMode: ConfigUpdateMode.SaveAndReincarnate });
    }

    public onSave() {
        this.props.RestClient.saveModuleConfig(this.props.ModuleName, { Config: this.state.ModuleConfig, UpdateMode: ConfigUpdateMode.OnlySave });
    }

    public onRevert() {
        this.setState({ ConfigIsLoading: true });
        this.loadConfig();
    }

    public onClickBreadcrumb(entry: Entry) {
        if (entry == null) {
            this.setState({ EntryChain: [], ParentEntry: null, CurrentSubEntries: this.state.ModuleConfig.Entries });
        } else {
            const idx = this.state.EntryChain.indexOf(entry);
            this.setState((prevState) => ({ EntryChain: prevState.EntryChain.slice(0, idx + 1), ParentEntry: entry, CurrentSubEntries: entry.SubEntries }));
        }
    }

    public preRenderBreadcrumb() {
        const entryChainButtons = this.state.EntryChain.map((entry, idx) =>
        (
            <Button key={idx} color="light" onClick={() => this.onClickBreadcrumb(entry)} disabled={idx == this.state.EntryChain.length - 1}>{entry.Key.Name}</Button>
        ));

        return (
            <ButtonGroup>
                <Button color="dark" disabled={this.state.EntryChain.length == 0} onClick={() => this.onClickBreadcrumb(null)}>Home</Button>
                {entryChainButtons}
            </ButtonGroup>
        );
    }

    public navigateToEntry(entry: Entry) {
        this.setState((prevState) => ({ EntryChain: [...prevState.EntryChain, entry], ParentEntry: entry, CurrentSubEntries: entry.SubEntries }));
    }

    public render() {
        return (
            <Card>
                <CardHeader tag="h2">
                    <FontAwesomeIcon icon={faCogs} className="right-space" />
                    {this.props.ModuleName} - Configuration
                </CardHeader>
                <CardBody>
                    {this.state.ConfigIsLoading ? (
                        <span className="font-bold font-small">Loading config ...</span>
                    ) : (
                        this.preRenderBreadcrumb()
                    )}
                    <Container fluid={true} className="up-space-lg">
                        <Row style={{background: "lightgray"}}>
                            <Col md={5}><span className="font-bold">Property</span></Col>
                            <Col md={7}><span className="font-bold">Value</span></Col>
                        </Row>
                        {<ConfigEditor ParentEntry={this.state.ParentEntry} Entries={this.state.CurrentSubEntries} navigateToEntry={this.navigateToEntry} />}
                    </Container>

                    <ButtonGroup className="up-space-lg">
                        <Button color="primary" onClick={() => this.onApply()}>
                            <FontAwesomeIcon icon={faSync} className="right-space" />
                            Save &amp; Restart
                        </Button>
                        <Button color="primary" onClick={() => this.onSave()}>
                            <FontAwesomeIcon icon={faSave} className="right-space" />
                            Save only
                        </Button>
                        <Button color="dark" onClick={() => this.onRevert()}>
                            <FontAwesomeIcon icon={faUndo} className="right-space" />
                            Revert
                        </Button>
                    </ButtonGroup>
                </CardBody>
            </Card>
        );
    }
}
