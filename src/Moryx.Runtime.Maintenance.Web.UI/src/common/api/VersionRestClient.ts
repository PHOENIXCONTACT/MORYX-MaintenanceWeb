/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

import Endpoint from "../models/Enpoint";
import RestClientBase from "./RestClientBase";

export default class VersionRestClient extends RestClientBase {
    private Endpoints: Endpoint[];

    private endpoints(): Promise<Endpoint[]> {
        return this.get<Endpoint[]>("/endpoints", []);
    }

    public async loadEndpoints(): Promise<void> {
        this.Endpoints = await this.endpoints();
    }

    public addressByServiceType(serviceType: string): string {
        for (const endpoint of this.Endpoints) {

            if (endpoint.Service === serviceType) {
                return endpoint.Address;
            }
        }

        return "";
    }
}
