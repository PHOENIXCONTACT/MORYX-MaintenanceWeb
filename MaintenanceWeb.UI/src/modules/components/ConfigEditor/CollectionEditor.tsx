import { faArrowsAltV, faFolderOpen, faPlus, faTrash } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Button, ButtonGroup, Col, Collapse, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, Row } from "reactstrap";
import Entry from "../../models/Entry";
import CollapsibleEntryEditorBase, { ICollapsibleEntryEditorBasePropModel } from "./CollapsibleEntryEditorBase";
import ConfigEditor from "./ConfigEditor";

interface ICollectionEditorStateModel {
    SelectedEntry: string;
    ExpandedEntryNames: string[];
}

export default class CollectionEditor extends CollapsibleEntryEditorBase<ICollectionEditorStateModel> {
    constructor(props: ICollapsibleEntryEditorBasePropModel) {
        super(props);
        this.state = {
            SelectedEntry: props.Entry.Value.Possible[0],
            ExpandedEntryNames: [],
        };
    }

    public toggleCollapsible(entryName: string) {
        if (this.isExpanded(entryName)) {
            this.setState((prevState) => ({ ExpandedEntryNames: prevState.ExpandedEntryNames.filter((name) => name != entryName) }));
        } else {
            this.setState((prevState) => ({ ExpandedEntryNames: [...prevState.ExpandedEntryNames, entryName] }));
        }
    }

    public isExpanded(entryName: string) {
        return this.state.ExpandedEntryNames.find((e: string) => e == entryName) != undefined;
    }

    public onSelect(e: React.FormEvent<HTMLInputElement>) {
        this.setState({ SelectedEntry: e.currentTarget.value });
    }

    public addEntry() {
        const prototype = this.props.Entry.Prototypes.find((proto: Entry) => proto.Key.Name == this.state.SelectedEntry);
        const entryClone = JSON.parse(JSON.stringify(prototype));
        this.props.Entry.SubEntries.push(entryClone);

        this.forceUpdate();
    }

    public removeEntry(entry: Entry) {
        this.props.Entry.SubEntries.splice(this.props.Entry.SubEntries.indexOf(entry), 1);
        this.forceUpdate();
    }

    public preRenderOptions() {
        const options: React.ReactNode[] = [];
        this.props.Entry.Value.Possible.map((colEntry, idx) =>
        (
            options.push(<option key={idx} value={colEntry}>{colEntry}</option>)
        ));
        return options;
    }

    public preRenderConfigEditor(entry: Entry): React.ReactNode {
        return <ConfigEditor ParentEntry={entry} Entries={entry.SubEntries} navigateToEntry={this.props.navigateToEntry} />;
    }

    public render() {
        return (
            <div className="up-space">
                <Collapse isOpen={this.props.IsExpanded}>
                    <Container fluid={true}>
                        {
                            this.props.Entry.SubEntries.map((entry, idx) =>
                                <div key={idx}>
                                    <Row>
                                        <Col md={4}>{entry.Key.Name}</Col>
                                        <Col>
                                            <ButtonGroup>
                                                <Button color="primary" onClick={() => this.props.navigateToEntry(entry)}>
                                                    <FontAwesomeIcon icon={faFolderOpen} className="right-space" />
                                                    Open
                                                </Button>
                                                <Button color="primary" onClick={() => this.toggleCollapsible(entry.Key.Name)}>
                                                    <FontAwesomeIcon icon={faArrowsAltV} className="right-space" />
                                                    Expand
                                                </Button>
                                                <Button color="primary" onClick={() => this.removeEntry(entry)}>
                                                    <FontAwesomeIcon icon={faTrash} className="right-space" />
                                                    Remove
                                                </Button>
                                            </ButtonGroup>
                                        </Col>
                                    </Row>
                                    <Collapse isOpen={this.isExpanded(entry.Key.Name)}>
                                        {this.preRenderConfigEditor(entry)}
                                    </Collapse>
                                </div>,
                            )
                        }
                        <Row className="up-space">
                            <Col md={4}>
                                <Input type="select" value={this.props.Entry.Value.Current}
                                       onChange={(e: React.FormEvent<HTMLInputElement>) => this.onSelect(e)}>
                                    {this.preRenderOptions()}
                                </Input>
                            </Col>
                            <Col md={8}>
                                <Button color="primary" onClick={() => this.addEntry()}>
                                    <FontAwesomeIcon icon={faPlus} className="right-space" />
                                    Add entry
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Collapse>
            </div>
        );
    }
}
