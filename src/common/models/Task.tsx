import { generateUniqueId } from "../utils/common";

export class Task {
  public _id: string;
  public title: string;
  public estimatedPomodoros: number;
  public priority: number;
  public description: string;
  public isCurrentTask: boolean;
  public schedule: any;
  public csec: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }
    this._id = obj._id || generateUniqueId();
    this.title = obj.title || "";
    this.estimatedPomodoros = obj.estPomos || 0;
    this.priority = obj.priority || 2;
    this.description = obj.description || "";
    this.isCurrentTask = !!obj.isCurrentTask;
    this.schedule = obj.schedule || new Date();
    this.csec = obj.csec || 0;
  }
}
