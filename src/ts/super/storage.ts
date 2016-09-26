import {Workspace} from "../model/workspace.ts";
import {ROSWeb} from "../model/rosweb.ts";
import {db} from "./db.ts";

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
  public GetWorkspaces(): Array<Workspace> {
    let rosweb: ROSWeb;
    try {
      rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
    } catch (e) {
      alert(e);
    }
    return rosweb.Workspaces;
  }

  public GetWorkspace(workspace_id: number): Workspace {
    let toReturn: Workspace;
    this.GetWorkspaces().forEach((workspace: Workspace, index: number, array: Workspace[]) => {
      if (workspace.id == workspace_id) {
        toReturn = workspace;
      }
    });
    return toReturn;
  }

  // New
  public NewWorkspace(name: string): Workspace {
    let id: number;
    let workspaces: Array<Workspace> = this.GetWorkspaces();
    if (workspaces.length == 0) {
      id = 1;
    } else {
      function sortByIdDesc(obj1: Workspace, obj2: Workspace) {
        if (obj1.id > obj2.id) return -1;
        if (obj1.id < obj2.id) return 1;
      }
      let lastWorkspace: Workspace = workspaces.sort(sortByIdDesc)[0];
      id = lastWorkspace.id + 1;
    }

    let workspace = new Workspace();
    workspace.id = id;
    workspace.name = name;
    return workspace;
  }

  // Save
  public SaveWorkspace(workspace: Workspace): void {
    let rosweb: any = JSON.parse(localStorage.getItem("ROSWeb"));
    workspace.db = {
      Tabs: db.Tabs,
      TabCounter: db.TabCounter,
      WidgetInstances: db.WidgetInstances,
      WidgetInstanceCounter: db.WidgetInstanceCounter
    };
    rosweb.Workspaces.push(workspace);
    localStorage.setItem("ROSWeb", JSON.stringify(rosweb));
  }

  // Load
  public LoadWorkspace(id: number): void {
    try {
      let workspaces: Array<Workspace> = JSON.parse(localStorage["ROSWeb"]["workspaces"]);
    }
    catch (e) {
      alert(e);
    }
  }

  // Remove
  public RemoveWorkspace(id: number): Workspace[] {
    let rosweb: ROSWeb;
    let updatedRosweb: ROSWeb = new ROSWeb();
    try {
      rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
      updatedRosweb.Workspaces = new Array<Workspace>();
      function filterById(workspace: Workspace) {
        return workspace.id != id;
      }
      updatedRosweb.Workspaces = rosweb.Workspaces.filter(filterById);
      localStorage.setItem("ROSWeb", JSON.stringify(updatedRosweb));
      return updatedRosweb.Workspaces;
    } catch (e) {
      throw new Error(e);
    }
  }

}

export var storage: Storage = new Storage();