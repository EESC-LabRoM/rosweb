import {Workspace} from "./workspace";

export class ROSWeb {

  constructor() {
    this.Workspaces = new Array<Workspace>();
  }

  public Workspaces: Workspace[];

}
