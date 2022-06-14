/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

require("../../types/constants");
import NotificationSystem = require("react-notification-system");
import CommonRestClient from "../api/CommonRestClient";
import { UPDATE_ENDPOINTS_LOADED, UPDATE_IS_CONNECTED, UPDATE_NOTIFICATION_INSTANCE, UPDATE_RESTCLIENT_ENDPOINT, UPDATE_SERVER_TIME, UPDATE_SHOW_WAIT_DIALOG } from "./CommonActions";
import { ActionType } from "./Types";

export interface CommonState {
    IsConnected: boolean;
    ServerTime: string;
    RestClient: CommonRestClient;
    ShowWaitDialog: boolean;
    NotificationSystem: NotificationSystem;
    EndpointsLoaded: boolean;
}

export const initialCommonState: CommonState = {
    IsConnected: false,
    NotificationSystem: null,
    RestClient: new CommonRestClient(window.location.hostname, parseInt(RESTSERVER_PORT, 10)),
    ServerTime: "",
    ShowWaitDialog: false,
    EndpointsLoaded: false
};

export function getCommonReducer(state: CommonState = initialCommonState, action: ActionType<{}>): CommonState {
  switch (action.type) {
      case UPDATE_ENDPOINTS_LOADED: {
        return { ...state, EndpointsLoaded: action.payload as boolean };
      }
      case UPDATE_RESTCLIENT_ENDPOINT: {
          state.RestClient.updateUrl(action.payload as string);
          return { ...state };
      }
    case UPDATE_SERVER_TIME: {
        return { ...state, ServerTime: action.payload as string };
    }
    case UPDATE_IS_CONNECTED: {
        return { ...state, IsConnected: action.payload as boolean };
    }
    case UPDATE_NOTIFICATION_INSTANCE: {
        return { ...state, NotificationSystem: action.payload as NotificationSystem };
    }
    case UPDATE_SHOW_WAIT_DIALOG: {
        return { ...state, ShowWaitDialog: action.payload as boolean };
    }
  }
  return state;
}
