/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

import NotificationSystem = require("react-notification-system");
import { ActionType } from "./Types";

export const UPDATE_ENDPOINTS_LOADED = "UPDATE_ENDPOINTS_LOADED";
export const UPDATE_RESTCLIENT_ENDPOINT = "UPDATE_COMMON_RESTCLIENT_ENDPOINT";
export const UPDATE_SERVER_TIME = "UPDATE_SERVER_TIME";
export const UPDATE_IS_CONNECTED = "UPDATE_IS_CONNECTED";
export const UPDATE_NOTIFICATION_INSTANCE = "UPDATE_NOTIFICATION_INSTANCE";
export const UPDATE_SHOW_WAIT_DIALOG = "UPDATE_SHOW_WAIT_DIALOG";

export function updateEndpointsLoaded(loaded: boolean): ActionType<boolean> {
    return { type: UPDATE_ENDPOINTS_LOADED, payload: loaded };
}

export function updateCommonRestClientEndpoint(address: string): ActionType<string> {
    return { type: UPDATE_RESTCLIENT_ENDPOINT, payload: address };
}

export function updateServerTime(newTime: string): ActionType<string> {
    return { type: UPDATE_SERVER_TIME, payload: newTime };
}

export function updateIsConnected(isConnected: boolean): ActionType<boolean> {
    return { type: UPDATE_IS_CONNECTED, payload: isConnected };
}

export function updateNotificationInstance(notificationSystem: NotificationSystem): ActionType<NotificationSystem> {
    return { type: UPDATE_NOTIFICATION_INSTANCE, payload: notificationSystem };
}

export function updateShowWaitDialog(showWaitDialog: boolean): ActionType<boolean> {
    return { type: UPDATE_SHOW_WAIT_DIALOG, payload: showWaitDialog };
}
