import {storage} from "../super/storage.ts";
import {db} from "../super/db.ts";
import {lightbox} from "../super/lightbox.ts";
import {EventsParent} from "./events.ts";

export class WorkspaceEvents extends EventsParent {

  constructor() {
    super();

    this.DelegateEvent(".jsOpenWorkspace", "click", this.OpenWorkspace);
  }

  public OpenWorkspace = (e?: MouseEvent) => {
    this._OpenWorkspace();
    e.preventDefault();
  }
  private _OpenWorkspace() {
    lightbox.ShowLightbox("aeaeaeae");
  }


}
