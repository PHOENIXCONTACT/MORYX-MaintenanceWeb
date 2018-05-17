import { faArrowsAltV, faFolderOpen } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Button, ButtonGroup, Card, CardBody, CardHeader, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Row, Table } from "reactstrap";
import Entry from "../../models/Entry";
import { EntryValueType, toString } from "../../models/EntryValueType";
import BooleanEditor from "./BooleanEditor";
import ByteEditor from "./ByteEditor";
import ClassEditor from "./ClassEditor";
import CollectionEditor from "./CollectionEditor";
import EnumEditor from "./EnumEditor";
import NumberEditor from "./NumberEditor";
import StringEditor from "./StringEditor";

interface IConfigEditorPropModel {
    ParentEntry: Entry;
    Entries: Entry[];
    navigateToEntry: (entry: Entry) => void;
}

interface IConfigEditorStateModel {
    ExpandedEntryNames: string[];
}

export default class ConfigEditor extends React.Component<IConfigEditorPropModel, IConfigEditorStateModel> {
    constructor(props: IConfigEditorPropModel) {
        super(props);
        this.state = {
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

    public selectPropertyByType(entry: Entry) {
        switch (entry.Value.Type) {
            case EntryValueType.Byte:
            {
                return (<ByteEditor Entry={entry} />);
            }
            case EntryValueType.Boolean:
            {
                return (<BooleanEditor Entry={entry} />);
            }
            case EntryValueType.Int16:
            case EntryValueType.UInt16:
            case EntryValueType.Int32:
            case EntryValueType.UInt32:
            case EntryValueType.Int64:
            case EntryValueType.UInt64:
            case EntryValueType.Single:
            case EntryValueType.Double:
            {
                return (<NumberEditor Entry={entry} />);
            }
            case EntryValueType.String:
            {
                return (<StringEditor Entry={entry} />);
            }
            case EntryValueType.Enum:
            {
                return (<EnumEditor Entry={entry} />);
            }
            case EntryValueType.Collection:
            case EntryValueType.Class:
            {
                return (
                    <ButtonGroup>
                        <Button color="secondary" onClick={() => this.props.navigateToEntry(entry)}>
                            <FontAwesomeIcon icon={faFolderOpen} className="right-space" />
                            Open
                        </Button>
                        <Button color="secondary" onClick={() => this.toggleCollapsible(entry.Key.Name)}>
                            <FontAwesomeIcon icon={faArrowsAltV} className="right-space" />
                            {this.isExpanded(entry.Key.Name) ? "Collapse" : "Expand"}
                        </Button>
                    </ButtonGroup>
                );
            }
        }

        return (<span>Not implemented yet: {toString(entry.Value.Type)}</span>);
    }

    public preRenderEntries(entries: Entry[]) {
        return entries.map((subEntry, idx) =>
        (
            <div key={idx}>
                <Row style={{background: idx % 2 == 0 ? "#f2f2f2" : "white", alignItems: "center", padding: "5px 0px 5px 0px"}}>
                    <Col md={7}>
                        <Container fluid={true}>
                            <Row>
                                <Col md={12} className=""><span className="font-bold align-self-center">{subEntry.Key.Name}</span></Col>
                            </Row>
                            <Row>
                                <Col md={12}><span className="font-disabled">{subEntry.Description}</span></Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col md={5}>
                    {
                        this.selectPropertyByType(subEntry)
                    }
                    </Col>
                </Row>
                { subEntry.Value.Type == EntryValueType.Collection &&
                    (
                        <Row>
                            <Col md={12}>
                                <CollectionEditor Entry={subEntry} IsExpanded={this.isExpanded(subEntry.Key.Name)} navigateToEntry={this.props.navigateToEntry} />
                            </Col>
                        </Row>
                    )
                }
                { subEntry.Value.Type == EntryValueType.Class &&
                    (
                        <Row>
                            <Col md={12}>
                                <ClassEditor Entry={subEntry} IsExpanded={this.isExpanded(subEntry.Key.Name)} navigateToEntry={this.props.navigateToEntry} />
                            </Col>
                        </Row>
                    )
                }
            </div>
        ));
    }

    public render() {
        let entries: any;
        if (this.props.ParentEntry != null && this.props.ParentEntry.Value.Type == EntryValueType.Collection) {
            entries = (
                <Row>
                    <Col md={12}>
                        <CollectionEditor Entry={this.props.ParentEntry} IsExpanded={true} navigateToEntry={this.props.navigateToEntry} />
                    </Col>
                </Row>
            );
        } else {
            entries = this.preRenderEntries(this.props.Entries);
        }

        return (
            <div>
                {entries}
            </div>
        );
    }
}
