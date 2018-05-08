import * as React from "react";
import { Badge } from "reactstrap";
import { ModuleServerModuleState } from "../../modules/models/ModuleServerModuleState";
import { HealthStateToCssClassConverter } from "../converter/HealthStateToCssClassConverter";

interface IHealthStateBadgeProps {
    HealthState: ModuleServerModuleState;
}

export class HealthStateBadge extends React.Component<IHealthStateBadgeProps> {
    constructor(props: IHealthStateBadgeProps) {
        super(props);
    }

    public render() {
        const text = ModuleServerModuleState[this.props.HealthState];
        const converter = new HealthStateToCssClassConverter();
        const color = converter.Convert(this.props.HealthState);

        return (<Badge color={color.Background}>{text}</Badge>);
    }
}
