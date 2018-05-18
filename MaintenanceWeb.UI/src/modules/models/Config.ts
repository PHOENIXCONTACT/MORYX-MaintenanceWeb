import Entry from "./Entry";

export default class Config {
    public Module: string;
    public Entries: Entry[];

    public static patchConfig(config: Config) {
        config.Entries.forEach((entry) => this.patchParent(entry, null));
    }

    public static patchParent(entry: Entry, parentEntry: Entry) {
        entry.Parent = parentEntry;
        entry.SubEntries.forEach((subEntry) => this.patchParent(subEntry, entry));
    }
}
