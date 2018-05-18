import { LogLevel } from "./LogLevel";

export default class LoggerModel {
    public Name: string;
    public ActiveLevel: LogLevel;
    public ChildLogger: LoggerModel[];
    public Parent: LoggerModel;
}
