import * as React from "react";
import { Input } from "reactstrap";
import InputEditorBase, { IInputEditorBasePropModel } from "./InputEditorBase";

export default class ByteEditor extends InputEditorBase {
    constructor(props: IInputEditorBasePropModel) {
        super(props);
        this.state = { };
    }

    private preRenderOptions() {
        const options: React.ReactNode[] = [];
        for (let idx = 0; idx < 256; ++idx) {
            options.push(<option key={idx} value={idx}>{"0x" + idx.toString(16).toUpperCase()}</option>);
        }
        return options;
    }

    public render() {
        return (
            <Input type="select" value={this.props.Entry.Value.Current}
                   onChange={(e: React.FormEvent<HTMLInputElement>) => this.onValueChange(e, this.props.Entry)}>
                   {this.preRenderOptions()}
            </Input>
        );
    }
}
