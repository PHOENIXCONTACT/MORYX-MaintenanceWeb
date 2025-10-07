/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

import { EntryUnitType } from "./EntryUnitType";
import { EntryValueType } from "./EntryValueType";

export default class EntryValue {
    public Type: EntryValueType;
    public UnitType: EntryUnitType;
    public Current: string;
    public Default: string;
    public Possible: string[];
    public IsReadOnly: boolean;
}
