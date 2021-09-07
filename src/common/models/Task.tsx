import { generateUniqueId } from "../utils/common";
import { Model, prop } from "../utils/ModelFactory";

@Model('Task')
export class Task {
    public id: string;
    public title: string;
    public estimatedPomodoros: number;
    public priority: number;
    public description: string;
    public isCurrentTask: boolean;

    constructor(obj?: any) {
        if(!obj) {
            obj = {};
        }
        this.id = obj.id || generateUniqueId();
        this.title = obj.title || '';
        this.estimatedPomodoros = obj.estPomos || 0;
        this.priority = obj.priority || 2;
        this.description = obj.description || '';
        this.isCurrentTask = !!obj.isCurrentTask;
    }
}