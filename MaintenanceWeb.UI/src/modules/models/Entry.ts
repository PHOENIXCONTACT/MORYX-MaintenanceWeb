import EntryKey from "./EntryKey"
import EntryValue from "./EntryValue"
import EntryValidation from "./EntryValidation"

export default class Entry
{
    Key : EntryKey;
    Value : EntryValue;
    SubEntries : Entry[];
    Prototypes : Entry[];
    Description : string;
    Validation : EntryValidation;
}