import { Model, prop } from "../utils/ModelFactory";

@Model('Task')
export class Task {

    @prop()
    public id: string;

    @prop()
    public title: string;
    public estimatedPomodoros: number;
}