import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { IAppState } from "../redux/AppState";
import { ActionType } from "../redux/Types";

interface IClockPropModel {
    Time?: string;
}

const mapStateToProps = (state: IAppState): IClockPropModel => {
    return {
      Time: state.Common.ServerTime,
    };
};

export class Clock extends React.Component<IClockPropModel> {
    constructor(props: IClockPropModel) {
        super(props);
    }

    public render() {
        return (
            <span>{this.props.Time}</span>
        );
    }
}

export default connect<IClockPropModel>(mapStateToProps)(Clock);
