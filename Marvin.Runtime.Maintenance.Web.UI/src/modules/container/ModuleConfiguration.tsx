import { faCogs, faSave, faSync, faUndo } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Action, Location, UnregisterCallback } from "history";
import * as qs from "query-string";
import * as React from "react";
import * as Notifications from "react-notification-system";
import NotificationSystem = require("react-notification-system");
import { RouteComponentProps, withRouter } from "react-router-dom";
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
    NotificationSystem: NotificationSystem.System;
}

interface IModuleConfigurationStateModel {
    ModuleConfig: Config;
    ConfigIsLoading: boolean;
    ParentEntry: Entry;
    CurrentSubEntries: Entry[];
    EntryChain: Entry[];
}

class ModuleConfiguration extends React.Component<IModuleConfigurationPropModel & RouteComponentProps<{}>, IModuleConfigurationStateModel> {
    public unregisterListener: UnregisterCallback;

    constructor(props: IModuleConfigurationPropModel & RouteComponentProps<{}>) {
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
        this.unregisterListener = this.props.history.listen(this.onHistoryChanged.bind(this));

        this.loadConfig();
    }

    public componentWillUnmount() {
        this.unregisterListener();
    }

    public loadConfig() {
        return this.props.RestClient.moduleConfig(this.props.ModuleName)
                             .then((data) => {
                                 Config.patchConfig(data);
                                 this.setState(
                                    {
                                        ModuleConfig: data,
                                        ParentEntry: null,
                                        CurrentSubEntries: data.Entries,
                                        ConfigIsLoading: false,
                                        EntryChain: [],
                                    });
                                 this.resolveEntryChainByPath(this.props.location);
                                });
    }

    public onApply() {
        this.props.RestClient.saveModuleConfig(this.props.ModuleName, { Config: this.state.ModuleConfig, UpdateMode: ConfigUpdateMode.SaveAndReincarnate })
                             .then((result) => this.props.NotificationSystem.addNotification({ title: "Saved", message: "Configuration was saved successfully. Module is restarting...", level: "success", autoDismiss: 5 }));
    }

    public onSave() {
        this.props.RestClient.saveModuleConfig(this.props.ModuleName, { Config: this.state.ModuleConfig, UpdateMode: ConfigUpdateMode.OnlySave })
                             .then((result) => this.props.NotificationSystem.addNotification({ title: "Saved", message: "Configuration was saved successfully", level: "success", autoDismiss: 5 }));
    }

    public onRevert() {
        this.setState({ ConfigIsLoading: true });
        this.loadConfig()
            .then((result) => this.props.NotificationSystem.addNotification({ title: "Reverted", message: "Configuration was reverted", level: "success", autoDismiss: 3 }));
    }

    public onClickBreadcrumb(entry: Entry) {
        if (entry == null) {
            this.setState({ EntryChain: [], ParentEntry: null, CurrentSubEntries: this.state.ModuleConfig.Entries });

            this.updatePath([]);
        } else {
            const idx = this.state.EntryChain.indexOf(entry);
            const updatedEntryChain = this.state.EntryChain.slice(0, idx + 1);
            this.setState((prevState) => ({ EntryChain: updatedEntryChain, ParentEntry: entry, CurrentSubEntries: entry.SubEntries }));

            this.updatePath(updatedEntryChain);
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
        this.updatePath(Entry.entryChain(entry));
    }

    private updatePath(entryChain: Entry[]) {
        this.props.history.push("?path=" + entryChain.map((entry) => entry.Key.Name).join(","));
    }

    private resolveEntryChainByPath(location: Location) {
        const query = qs.parse(location.search);
        if (query != null && "path" in query) {
            const entryChain: Entry[] = [];
            let currentEntry: Entry = null;

            query.path.split(",").forEach((element: string) => {
                const searchableEntries: Entry[] = currentEntry != null ? currentEntry.SubEntries : this.state.ModuleConfig.Entries;
                const filtered = searchableEntries.filter((entry) => entry.Key.Name == element);

                if (filtered.length > 0) {
                    currentEntry = filtered[0];
                    entryChain.push(currentEntry);
                }
            });

            this.setState({ EntryChain: entryChain, ParentEntry: currentEntry, CurrentSubEntries: currentEntry != null ? currentEntry.SubEntries : this.state.ModuleConfig.Entries });
        } else {
            this.setState({ EntryChain: [], ParentEntry: null, CurrentSubEntries: this.state.ModuleConfig.Entries });
        }
    }

    private onHistoryChanged(location: Location, action: Action) {
        this.resolveEntryChainByPath(location);
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

export default withRouter<IModuleConfigurationPropModel & RouteComponentProps<{}>>(ModuleConfiguration);
