import {storage} from "../super/storage.ts";
// import {db} from "../super/db.ts";
import {lightbox} from "../super/lightbox.ts";
import {EventsParent} from "./events.ts";
import {Workspace} from "../model/workspace.ts";

declare var MyApp: any;

export class WorkspaceEvents extends EventsParent {

  constructor() {
    super();

    this.DelegateEvent(".jsOpenWorkspace", "click", this.OpenWorkspace);
    this.DelegateEvent(".jsSaveWorkspace", "click", this.SaveWorkspace);
    this.DelegateEvent(".jsLoadWorkspace", "click", this.LoadWorkspace);
    this.DelegateEvent(".jsRemoveWorkspace", "click", this.RemoveWorkspace);
  }

  public OpenWorkspace = (e?: MouseEvent) => {
    this._OpenWorkspace();
    e.preventDefault();
  }
  private _OpenWorkspace() {
    let workspaces: Array<Workspace> = storage.GetWorkspaces();
    let html = MyApp.templates.workspaceList(workspaces);
    lightbox.ShowLightbox(html);
  }

  public SaveWorkspace = (e?: MouseEvent) => {
    if (window.confirm("Save a new workspace?")) {
      this._SaveWorkspace();
    } else {

    }
    e.preventDefault();
  }
  private _SaveWorkspace(): void {
    let workspace = new Workspace();
    workspace = storage.NewWorkspace($("#jsWorkspaceName").val());
    storage.SaveWorkspace(workspace);
  }

  public LoadWorkspace = (e?: MouseEvent) => {
    let workspace_id: number = parseInt($(e.toElement).attr("data-workspace-id"));
    this._LoadWorkspace(workspace_id);
    e.preventDefault();
  }
  private _LoadWorkspace(workspace_id: number): void {
    let workspace: Workspace = storage.GetWorkspace(workspace_id);
    // db.loadWorkspace(workspace);
    lightbox.CloseLightbox();
  }

  public RemoveWorkspace = (e?: MouseEvent) => {
    let workspace_id: number = parseInt($(e.toElement).attr("data-workspace-id"));
    let workspace = storage.GetWorkspace(workspace_id);
    this._RemoveWorkspace(workspace);
    e.preventDefault();
  }
  private _RemoveWorkspace(workspace: Workspace): void {
    if (window.confirm("Are you sure you want to remove workspace #" + workspace.id + " (" + workspace.id + ") ?")) {
      let html = MyApp.templates.workspaceList(storage.RemoveWorkspace(workspace.id));
      lightbox.UpdateLightbox(html);
    } else {
      // do nothing
    }
  }

}
