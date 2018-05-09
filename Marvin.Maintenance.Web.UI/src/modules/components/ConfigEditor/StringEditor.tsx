import * as React from "react";
import { Input } from "reactstrap";
import { toString } from "../../models/EntryValueType";
import InputEditorBase, { IInputEditorBasePropModel } from "./InputEditorBase";

export default class StringEditor extends InputEditorBase {
    constructor(props: IInputEditorBasePropModel) {
        super(props);
        this.state = { };
    }

    public render() {
        return (<Input type="text"
                        onChange={(e: React.FormEvent<HTMLInputElement>) => this.onValueChange(e, this.props.Entry)}
                        placeholder={"Please enter a string ..."}
                        disabled={this.props.Entry.Value.IsReadOnly}
                        value={this.props.Entry.Value.Current == null ? "" : this.props.Entry.Value.Current} />);
    }
}
