import { routerReducer, RouterState } from "react-router-redux";
import { getDashboardReducer, IDashboardState, initialDashboardState } from "../../dashboard/redux/DashboardState";
import { getDatabaseReducer, IDatabaseState, initialDatabaseState } from "../../databases/redux/DatabaseState";
import { getLogReducer, ILogState, initialLogState } from "../../log/redux/LogState";
import { getModulesReducer, IModulesState, initialModulesState } from "../../modules/redux/ModulesState";
import { getCommonReducer, ICommonState, initialCommonState } from "./CommonState";
import { ActionType } from "./Types";

export interface IAppState {
    Common: ICommonState;
    Dashboard: IDashboardState;
    Modules: IModulesState;
    Databases: IDatabaseState;
    Log: ILogState;
}

export const initialAppState: IAppState = {
    Common: initialCommonState,
    Dashboard: initialDashboardState,
    Modules: initialModulesState,
    Databases: initialDatabaseState,
    Log: initialLogState,
};

export function getAppReducer(state: IAppState = initialAppState, action: ActionType<{}>): IAppState {
    return {
        Common: getCommonReducer(state.Common, action),
        Dashboard: getDashboardReducer(state.Dashboard, action),
        Modules: getModulesReducer(state.Modules, action),
        Databases: getDatabaseReducer(state.Databases, action),
        Log: getLogReducer(state.Log, action),
    };
}
