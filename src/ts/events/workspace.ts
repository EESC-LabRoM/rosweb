import { storage } from "../super/storage";
// import {db} from "../super/db.ts";
import { lightbox } from "../super/lightbox";
import { EventsParent } from "./events";
import { Workspace } from "../model/workspace";
import { SerializedWorkspace } from "../model/serialized_workspace";
import { currentWorkspace } from "../model/workspace";

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
    let workspaces: Array<SerializedWorkspace> = storage.GetWorkspaces();
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
    let workspace = new SerializedWorkspace();
    workspace = storage.NewWorkspace($("#jsWorkspaceName").val());
    workspace.data = currentWorkspace.extractData();
    storage.SaveWorkspace(workspace);
  }

  public LoadWorkspace = (e?: MouseEvent) => {
    let workspace_id: number = parseInt($(e.toElement).attr("data-workspace-id"));
    this._LoadWorkspace(workspace_id);
    e.preventDefault();
  }
  private _LoadWorkspace(workspace_id: number): void {
    let workspace: SerializedWorkspace = storage.GetWorkspace(workspace_id);
    currentWorkspace.loadWorkspace(workspace);
    lightbox.CloseLightbox();
  }

  public RemoveWorkspace = (e?: MouseEvent) => {
    let workspace_id: number = parseInt($(e.toElement).attr("data-workspace-id"));
    let workspace = storage.GetWorkspace(workspace_id);
    this._RemoveWorkspace(workspace);
    e.preventDefault();
  }
  private _RemoveWorkspace(workspace: SerializedWorkspace): void {
    if (window.confirm("Are you sure you want to remove workspace #" + workspace.id + " (" + workspace.id + ") ?")) {
      let html = MyApp.templates.workspaceList(storage.RemoveWorkspace(workspace.id));
      lightbox.UpdateLightbox(html);
    } else {
      // do nothing
    }
  }

}
