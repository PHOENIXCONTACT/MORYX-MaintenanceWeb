import "bootstrap-toggle/css/bootstrap2-toggle.css";
import * as React from "react";
import BootstrapToggle from "react-bootstrap-toggle";
import { Input } from "reactstrap";
import Entry from "../../models/Entry";
import InputEditorBase, { IInputEditorBasePropModel } from "./InputEditorBase";

export default class ByteEditor extends InputEditorBase {
    constructor(props: IInputEditorBasePropModel) {
        super(props);
        this.state = { };
    }

    public onToggle(e: React.MouseEvent<HTMLElement>) {
        this.props.Entry.Value.Current = this.props.Entry.Value.Current === "True" ? this.props.Entry.Value.Current = "False" : this.props.Entry.Value.Current = "True";
        this.forceUpdate();
    }

    public render() {
        return (
            <BootstrapToggle active={this.props.Entry.Value.Current.toLowerCase() === "true"}
                             disabled={this.props.Entry.Value.IsReadOnly}
                             onClick={(e: React.MouseEvent<HTMLElement>) => this.onToggle(e)}
                             height="35px" />
        );
    }
}
