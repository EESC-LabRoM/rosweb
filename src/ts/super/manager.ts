import {Db} from "./db.ts";
import {Design} from "./design.ts";
import {Frontend} from "./frontend.ts";
import {Names} from "./names.ts";
import {Trigger} from "./trigger.ts";
import {WidgetsManager} from "./widgets_manager.ts";

export class Manager {

  public Db: Db;
  public Design: Design;
  public Frontend: Frontend;
  public Names: Names;
  public Trigger: Trigger;
  public WidgetsManager: WidgetsManager;

  public constructor() {
    this.Db = new Db();
    this.Design = new Design();
    this.Frontend = new Frontend();
    this.Names = new Names();
    this.Trigger = new Trigger();
    this.WidgetsManager = new WidgetsManager();
  }

}
