import {Workspace} from "./workspace";
import {SerializedWorkspace} from "../model/serialized_workspace";

export class ROSWeb {

  constructor() {
    this.Workspaces = new Array<SerializedWorkspace>();
  }

  public Workspaces: SerializedWorkspace[];

}
