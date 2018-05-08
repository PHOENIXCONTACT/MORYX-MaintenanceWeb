import * as React from "react";
import { Button, ButtonGroup, Col, Collapse, Container, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import CollapsibleEntryEditorBase, { ICollapsibleEntryEditorBasePropModel } from "./CollapsibleEntryEditorBase";
import ConfigEditor from "./ConfigEditor";

interface IClassEditorStateModel {
}

export default class ClassEditor extends CollapsibleEntryEditorBase<IClassEditorStateModel> {
    constructor(props: ICollapsibleEntryEditorBasePropModel) {
        super(props);
        this.state = { };
    }

    public preRenderConfigEditor(): React.ReactNode {
        return <ConfigEditor Entries={this.props.Entry.SubEntries} navigateToEntry={this.props.navigateToEntry} /> as React.ReactNode;
    }

    public render() {
        return (
            <div>
                <Collapse isOpen={this.props.IsExpanded}>
                    <Container fluid={true}>
                        {this.preRenderConfigEditor()}
                    </Container>
                </Collapse>
            </div>
        );
    }
}
