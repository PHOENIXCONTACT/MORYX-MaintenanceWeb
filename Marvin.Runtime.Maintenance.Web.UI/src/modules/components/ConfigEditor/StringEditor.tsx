import * as React from "react";
import { Input } from "reactstrap";
import { toString } from "../../models/EntryValueType";
import EnumEditor from "./EnumEditor";
import InputEditorBase, { IInputEditorBasePropModel } from "./InputEditorBase";

export default class StringEditor extends InputEditorBase {
    constructor(props: IInputEditorBasePropModel) {
        super(props);
        this.state = { };
    }

    private preRenderInput() {
        return (<Input type="text"
                        onChange={(e: React.FormEvent<HTMLInputElement>) => this.onValueChange(e, this.props.Entry)}
                        placeholder={"Please enter a string ..."}
                        disabled={this.props.Entry.Value.IsReadOnly}
                        value={this.props.Entry.Value.Current == null ? "" : this.props.Entry.Value.Current} />);
    }

    private preRenderPossibleValueList() {
        return (<EnumEditor Entry={this.props.Entry} />);
    }

    public render() {
        return this.props.Entry.Value.Possible != null && this.props.Entry.Value.Possible.length > 0 ?
                this.preRenderPossibleValueList() : this.preRenderInput();
    }
}
