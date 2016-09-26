import {Workspace} from "./workspace.ts";

export class ROSWeb {

  constructor() {
    this.Workspaces = new Array<Workspace>();
  }

  public Workspaces: Workspace[];

}
