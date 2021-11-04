/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

export enum TestConnectionResult {
    ConfigurationError,
    ConnectionError,
    ConnectionOkDbDoesNotExist,
    PendingMigrations,
    Success,
}
