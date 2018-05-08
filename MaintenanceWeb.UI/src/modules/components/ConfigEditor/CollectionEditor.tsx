import * as React from "react";
import { Button, ButtonGroup, Col, Collapse, Container, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
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

    public onSelect(value: string) {
        this.setState({ SelectedEntry: value });
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

    public preRenderConfigEditor(entry: Entry): React.ReactNode {
        return <ConfigEditor Entries={entry.SubEntries} navigateToEntry={this.props.navigateToEntry} />;
    }

    public render() {
        return (
            <div className="up-space">
                <Collapse isOpen={this.props.IsExpanded}>
                    <Container fluid={true}>
                        {
                            this.props.Entry.SubEntries.map((entry, idx) =>
                                <div>
                                    <Row key={idx}>
                                        <Col md={4}>{entry.Key.Name}</Col>
                                        <Col>
                                            <Button color="primary" onClick={() => this.props.navigateToEntry(entry)}>Open</Button>
                                            <Button color="primary" onClick={() => this.toggleCollapsible(entry.Key.Name)}>Expand</Button>
                                            <Button color="primary" onClick={() => this.removeEntry(entry)}>Remove</Button>
                                        </Col>
                                    </Row>
                                    <Collapse isOpen={this.isExpanded(entry.Key.Name)}>
                                        {this.preRenderConfigEditor(entry)}
                                    </Collapse>
                                </div>,
                            )
                        }
                        <Row>
                            <Col md={12}>
                                <ButtonGroup>
                                    <UncontrolledDropdown>
                                        <DropdownToggle caret>
                                            {this.state.SelectedEntry}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {
                                                this.props.Entry.Value.Possible.map((colEntry, idx) =>
                                                (
                                                    <DropdownItem key={idx} onClick={() => this.onSelect(colEntry)}>{colEntry}</DropdownItem>
                                                ))
                                            }
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                    <Button color="primary" onClick={() => this.addEntry()}>Add entry</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Container>
                </Collapse>
            </div>
        );
    }
}
