import { Model, prop } from "../utils/ModelFactory";

@Model('super')
export class Task {

    @prop()
    public id: string;

    public title: string;
    public estimatedPomodoros: number;
}