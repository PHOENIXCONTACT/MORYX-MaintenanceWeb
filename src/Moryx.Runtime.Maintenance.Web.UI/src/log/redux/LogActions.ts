/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/
import { ActionType } from "../../common/redux/Types";
import LoggerModel from "../models/LoggerModel";

export const UPDATE_RESTCLIENT_ENDPOINT = "UPDATE_LOG_RESTCLIENT_ENDPOINT";
export const UPDATE_LOGGERS = "UPDATE_LOGGERS";

export function updateLogRestClientEndpoint(address: string): ActionType<string> {
    return { type: UPDATE_RESTCLIENT_ENDPOINT, payload: address };
}

export function updateLoggers(loggers: LoggerModel[]): ActionType<LoggerModel[]> {
    return { type: UPDATE_LOGGERS, payload: loggers };
}
