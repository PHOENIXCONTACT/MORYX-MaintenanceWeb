/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

import InvocationResponse from "../../common/api/responses/InvocationResponse";
import RestClientBase from "../../common/api/RestClientBase";
import DatabaseConfigModel from "../models/DatabaseConfigModel";
import DataModel from "../models/DataModel";
import ExecuteSetupRequest from "./requests/ExecuteSetupRequest";
import RestoreDatabaseRequest from "./requests/RestoreDatabaseRequest";
import DatabaseMigrationSummary from "./responses/DatabaseMigrationSummary";
import TestConnectionResponse from "./responses/TestConnectionResponse";

export default class DatabasesRestClient extends RestClientBase {
    public databaseModels(): Promise<DataModel[]> {
        return this.get<DataModel[]>("", []);
    }

    public deleteAllDatabaseModels(): Promise<InvocationResponse> {
        return this.deleteNoBody<InvocationResponse>("", new InvocationResponse());
    }

    public databaseModel(targetModel: string): Promise<DataModel> {
        return this.get<DataModel>("model/"  + targetModel, new DataModel());
    }

    public saveDatabaseConfig(request: DatabaseConfigModel, targetModel: string): Promise<Response> {
        return this.post<DatabaseConfigModel, Response>("model/" + targetModel + "/config", request, new Response());
    }

    public testDatabaseConfig(request: DatabaseConfigModel, targetModel: string): Promise<TestConnectionResponse> {
        return this.post<DatabaseConfigModel, TestConnectionResponse>("model/" + targetModel + "/config/test", request, new TestConnectionResponse());
    }

    public createDatabase(request: DatabaseConfigModel, targetModel: string): Promise<InvocationResponse> {
        return this.post<DatabaseConfigModel, InvocationResponse>("model/" + targetModel + "/create", request, new InvocationResponse());
    }

    public eraseDatabase(request: DatabaseConfigModel, targetModel: string): Promise<InvocationResponse> {
        return this.delete<DatabaseConfigModel, InvocationResponse>("model/" + targetModel, request, new InvocationResponse());
    }

    public dumpDatabase(request: DatabaseConfigModel, targetModel: string): Promise<InvocationResponse> {
        return this.post<DatabaseConfigModel, InvocationResponse>("model/" + targetModel + "/dump", request, new InvocationResponse());
    }

    public restoreDatabase(request: RestoreDatabaseRequest, targetModel: string): Promise<InvocationResponse> {
        return this.post<RestoreDatabaseRequest, InvocationResponse>("model/" + targetModel + "/restore", request, new InvocationResponse());
    }

    public applyMigration(targetModel: string, request: DatabaseConfigModel): Promise<DatabaseMigrationSummary> {
        return this.post<DatabaseConfigModel, DatabaseMigrationSummary>("model/" + targetModel + "/migrate", request, new DatabaseMigrationSummary());
    }

    public executeSetup(targetModel: string, request: ExecuteSetupRequest): Promise<InvocationResponse> {
        return this.post<ExecuteSetupRequest, InvocationResponse>("model/"  + targetModel + "/setup", request, new InvocationResponse());
    }
}
