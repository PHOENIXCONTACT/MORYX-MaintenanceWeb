import * as React from "react";
import { Button, ButtonGroup, Col, Collapse, Container, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import Entry from "../../models/Entry";

export interface IInputEditorBasePropModel {
    Entry: Entry;
}

interface IInputEditorBaseStateModel {
}

export default class InputEditorBase extends React.Component<IInputEditorBasePropModel, IInputEditorBaseStateModel> {
    constructor(props: IInputEditorBasePropModel) {
        super(props);
        this.state = { };
    }

    public onValueChange(e: React.FormEvent<HTMLInputElement>, entry: Entry) {
        entry.Value.Current = e.currentTarget.value;
        this.forceUpdate();
    }

    public render() {
        return (<div />);
    }
}
