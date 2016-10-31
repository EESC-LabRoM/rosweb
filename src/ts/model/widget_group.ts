import { frontend } from "../super/frontend"
import { currentWorkspace } from "./workspace"

export class WidgetGroup {

  public id: number;
  public name: string;

  constructor(name: string) {
    this.name = name;

    currentWorkspace.create<WidgetGroup>(this);

    frontend.newWidgetGroup(this);
  }

}