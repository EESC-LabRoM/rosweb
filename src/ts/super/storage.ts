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
      console.log(rosweb);
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

  // Save
  public SaveWorkspace(workspace: Workspace): void {
    let rosweb: any = JSON.parse(localStorage.getItem("ROSWeb"));
    workspace.db = db;
    rosweb.Workspaces.push(workspace);
    localStorage.setItem("ROSWeb", JSON.stringify(rosweb));
  }

  // Load
  public LoadWorkspace(id: number): void {
    try {
      let workspaces: Array<Workspace> = JSON.parse(localStorage["ROSWeb"]["workspaces"]);
      console.log(workspaces);
    }
    catch (e) {
      alert(e);
    }
  }

  // Remove
  public RemoveWorkspace(): void {

  }

}

export var storage: Storage = new Storage();