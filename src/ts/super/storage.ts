import { Workspace } from "../model/workspace";
import { ROSWeb } from "../model/rosweb";
import {SerializedWorkspace} from "../model/serialized_workspace";

class Storage {

  private count: number;

  constructor() {
    this.count = 0;
    if (localStorage["ROSWeb"] == undefined) {
      let rosweb = new ROSWeb();
      localStorage.setItem("ROSWeb", JSON.stringify(rosweb));
      console.log("creating rosweb localstorage");
    }
  }
  public Init(): void {
  }

  // Get
  public GetWorkspaces(): Array<SerializedWorkspace> {
    let rosweb: ROSWeb;
    try {
      rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
    } catch (e) {
      alert(e);
    }
    return rosweb.Workspaces;
  }

  public GetWorkspace(workspace_id: number): SerializedWorkspace {
    let toReturn: SerializedWorkspace;
    this.GetWorkspaces().forEach((workspace: SerializedWorkspace, index: number, array: SerializedWorkspace[]) => {
      if (workspace.id == workspace_id) {
        toReturn = workspace;
      }
    });
    return toReturn;
  }

  // New
  public NewWorkspace(name: string): SerializedWorkspace {
    let id: number;
    let workspaces: Array<SerializedWorkspace> = this.GetWorkspaces();
    function sortByIdDesc(obj1: SerializedWorkspace, obj2: SerializedWorkspace) {
      if (obj1.id > obj2.id) return -1;
      if (obj1.id < obj2.id) return 1;
    }
    if (workspaces.length == 0) {
      id = 1;
    } else {
      let lastWorkspace: SerializedWorkspace = workspaces.sort(sortByIdDesc)[0];
      id = lastWorkspace.id + 1;
    }

    let workspace = new SerializedWorkspace();
    workspace.id = id;
    workspace.name = name;
    return workspace;
  }

  // Save
  public SaveWorkspace(workspace: SerializedWorkspace): void {
    let rosweb: any = JSON.parse(localStorage.getItem("ROSWeb"));
    rosweb.Workspaces.push(workspace);
    localStorage.setItem("ROSWeb", JSON.stringify(rosweb));
  }

  // Load
  public LoadWorkspace(id: number): void {
    try {
      let workspaces: Array<SerializedWorkspace> = JSON.parse(localStorage["ROSWeb"]["workspaces"]);
    }
    catch (e) {
      alert(e);
    }
  }

  // Remove
  public RemoveWorkspace(id: number): SerializedWorkspace[] {
    let rosweb: ROSWeb;
    let updatedRosweb: ROSWeb = new ROSWeb();
    function filterById(workspace: SerializedWorkspace) {
      return workspace.id != id;
    }
    try {
      rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
      updatedRosweb.Workspaces = new Array<SerializedWorkspace>();
      updatedRosweb.Workspaces = rosweb.Workspaces.filter(filterById);
      localStorage.setItem("ROSWeb", JSON.stringify(updatedRosweb));
      return updatedRosweb.Workspaces;
    } catch (e) {
      throw new Error(e);
    }
  }

}

export var storage: Storage = new Storage();