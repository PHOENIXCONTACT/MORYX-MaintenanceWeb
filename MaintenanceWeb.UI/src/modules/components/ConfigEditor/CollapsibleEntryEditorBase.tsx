import * as React from "react";
import { Collapse } from "reactstrap";
import Entry from "../../models/Entry";

export interface ICollapsibleEntryEditorBasePropModel {
    Entry: Entry;
    IsExpanded: boolean;
    navigateToEntry: (entry: Entry) => void;
}

export default class CollapsibleEntryEditorBase<T> extends React.Component<ICollapsibleEntryEditorBasePropModel, T> {
    constructor(props: ICollapsibleEntryEditorBasePropModel) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Collapse isOpen={this.props.IsExpanded}>
                    {this.props.children}
                </Collapse>
            </div>
        );
    }
}
