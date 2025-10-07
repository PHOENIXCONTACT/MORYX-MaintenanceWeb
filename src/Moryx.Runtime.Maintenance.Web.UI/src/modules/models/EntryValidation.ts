/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/
import { EntryUnitType } from "./EntryUnitType";

export default class EntryValidation {
    public Minimum: number;
    public Maximum: number;
    public Regex: string;
    public IsRequired: boolean;
    public IsPassword: boolean;

    public static IsItPassword(UntiType: EntryUnitType): boolean {
            return UntiType === EntryUnitType.Password;
    }
}
