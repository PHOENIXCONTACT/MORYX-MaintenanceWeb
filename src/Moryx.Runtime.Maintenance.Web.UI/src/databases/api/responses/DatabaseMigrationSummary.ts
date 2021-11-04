/*
 * Copyright (c) 2021, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

import { MigrationResult } from "../../models/MigrationResult";

export default class DatabaseMigrationSummary {
    public Result: MigrationResult;
    public ExecutedMigrations: string[];
}
