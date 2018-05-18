import EntryKey from "./EntryKey";
import EntryValidation from "./EntryValidation";
import EntryValue from "./EntryValue";

export default class Entry {
    public Key: EntryKey;
    public Value: EntryValue;
    public SubEntries: Entry[];
    public Prototypes: Entry[];
    public Description: string;
    public Validation: EntryValidation;
    public Parent: Entry;

    public static entryChain(entry: Entry) {
        const entryChain: Entry[] = [entry];
        let currentEntry = entry;
        while (currentEntry != null) {
            if (currentEntry.Parent != null) {
                entryChain.push(currentEntry.Parent);
            }

            currentEntry = currentEntry.Parent;
        }

        entryChain.reverse();
        return entryChain;
    }
}
