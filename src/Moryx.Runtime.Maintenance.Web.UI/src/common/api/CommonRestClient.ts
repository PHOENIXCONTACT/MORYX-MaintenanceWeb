/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

import ApplicationInformationResponse from "./responses/ApplicationInformationResponse";
import ApplicationLoadResponse from "./responses/ApplicationLoadResponse";
import HostInformationResponse from "./responses/HostInformationResponse";
import ServerTimeResponse from "./responses/ServerTimeResponse";
import SystemLoadResponse from "./responses/SystemLoadResponse";
import RestClientBase from "./RestClientBase";

export default class CommonRestClient extends RestClientBase {
    public serverTime(): Promise<ServerTimeResponse> {
        return this.get<ServerTimeResponse>("/ServerTime", new ServerTimeResponse());
    }

    public applicationInfo(): Promise<ApplicationInformationResponse> {
        return this.get<ApplicationInformationResponse>("/ApplicationInfo", new ApplicationInformationResponse());
    }

    public hostInfo(): Promise<HostInformationResponse> {
        return this.get<HostInformationResponse>("/HostInfo", new HostInformationResponse());
    }

    public systemLoad(): Promise<SystemLoadResponse> {
        return this.get<SystemLoadResponse>("/SystemLoad", new SystemLoadResponse());
    }

    public applicationLoad(): Promise<ApplicationLoadResponse> {
        return this.get<ApplicationLoadResponse>("/ApplicationLoad", new ApplicationLoadResponse());
    }
}
