import { ActionType } from "../../common/redux/Types";
import LogRestClient from "../api/LogRestClient";
import LoggerModel from "../models/LoggerModel";
import { UPDATE_LOGGERS } from "./LogActions";

export interface ILogState {
    RestClient: LogRestClient;
    Loggers: LoggerModel[];
}

export const initialLogState: ILogState = {
    RestClient: new LogRestClient(window.location.hostname, 80),
    Loggers: [],
};

export function getLogReducer(state: ILogState = initialLogState, action: ActionType<{}>): ILogState {
  switch (action.type) {
    case UPDATE_LOGGERS:
    {
        return { ...state, Loggers: action.payload as LoggerModel[] };
    }
  }
  return state;
}
