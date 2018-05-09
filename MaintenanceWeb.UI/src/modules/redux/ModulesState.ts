require("../../types/constants");
import { ActionType } from "../../common/redux/Types";
import ModulesRestClient from "../api/ModulesRestClient";
import Config from "../models/Config";
import { FailureBehaviour } from "../models/FailureBehaviour";
import { ModuleServerModuleState } from "../models/ModuleServerModuleState";
import { ModuleStartBehaviour } from "../models/ModuleStartBehaviour";
import NotificationModel from "../models/NotificationModel";
import ServerModuleModel from "../models/ServerModuleModel";
import { UPDATE_FAILURE_BEHAVIOUR, UPDATE_HEALTHSTATE, UPDATE_MODULES, UPDATE_NOTIFICATIONS, UPDATE_START_BEHAVIOUR } from "./ModulesActions";

export interface IModulesState {
  RestClient: ModulesRestClient;
  Modules: ServerModuleModel[];
  Configs: Config[];
}

export const initialModulesState: IModulesState = {
  RestClient: new ModulesRestClient(window.location.hostname, parseInt(RESTSERVER_PORT)),
  Modules: [],
  Configs: [],
};

export function getModulesReducer(state: IModulesState = initialModulesState, action: ActionType<{}>): IModulesState {
  switch (action.type) {
    case UPDATE_MODULES:
    {
      return { ...state, Modules: action.payload as ServerModuleModel[] };
    }
    case UPDATE_HEALTHSTATE:
    {
      const localPayload = action.payload as {  moduleName: string, healthState: ModuleServerModuleState };

      return {
        ...state,
        Modules: state.Modules.map(
          (module, i) => module.Name === localPayload.moduleName ? {...module, HealthState: localPayload.healthState} : module),
      };
    }
    case UPDATE_NOTIFICATIONS:
    {
      const localPayload = action.payload as {  moduleName: string, notifications: NotificationModel[] };

      return {
        ...state,
        Modules: state.Modules.map(
          (module, i) => module.Name === localPayload.moduleName ? {...module, Notifications: localPayload.notifications} : module),
      };
    }
    case UPDATE_START_BEHAVIOUR:
    {
      const localPayload = action.payload as { moduleName: string, startBehaviour: ModuleStartBehaviour };

      return {
        ...state,
        Modules: state.Modules.map(
          (module, i) => module.Name === localPayload.moduleName ? {...module, StartBehaviour: localPayload.startBehaviour} : module),
      };
    }
    case UPDATE_FAILURE_BEHAVIOUR:
    {
      const localPayload = action.payload as { moduleName: string, failureBehaviour: FailureBehaviour };

      return {
        ...state,
        Modules: state.Modules.map(
          (module, i) => module.Name === localPayload.moduleName ? {...module, FailureBehaviour: localPayload.failureBehaviour} : module),
      };
    }
  }
  return state;
}
