import * as React from "react";
import { Input } from "reactstrap";
import { toString } from "../../models/EntryValueType";
import InputEditorBase, { IInputEditorBasePropModel } from "./InputEditorBase";

export default class EnumEditor extends InputEditorBase {
    constructor(props: IInputEditorBasePropModel) {
        super(props);
        this.state = { };
    }

    public render() {
        return (
            <Input type="select" value={this.props.Entry.Value.Current}
                   onChange={(e: React.FormEvent<HTMLInputElement>) => this.onValueChange(e, this.props.Entry)}>
                {
                    this.props.Entry.Value.Possible.map((possibleValue, idx) => {
                        return (<option key={idx}>{possibleValue}</option>);
                    })
                }
            </Input>
        );
    }
}
