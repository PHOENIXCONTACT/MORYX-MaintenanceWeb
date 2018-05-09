import * as React from "react";
import { Input } from "reactstrap";
import { toString } from "../../models/EntryValueType";
import InputEditorBase, { IInputEditorBasePropModel } from "./InputEditorBase";

export default class NumberEditor extends InputEditorBase {
    constructor(props: IInputEditorBasePropModel) {
        super(props);
        this.state = { };
    }

    public render() {
        return (<Input type="number"
                        onChange={(e: React.FormEvent<HTMLInputElement>) => this.onValueChange(e, this.props.Entry)}
                        placeholder={"Please enter a value of type: " + toString(this.props.Entry.Value.Type) + " ..."}
                        disabled={this.props.Entry.Value.IsReadOnly}
                        value={this.props.Entry.Value.Current} />);
    }
}
