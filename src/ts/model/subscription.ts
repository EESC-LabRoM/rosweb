// Db
import {db} from "../super/db.ts";

// Models
import {Widget} from "./widget.ts";

export class Subscription {
  
  public id: number;
  public Widget: Widget;
  public topic_name: string;
  public topic_type: string;
  public typedef: {};
  
  constructor(widget_id: number, topic_name: string, topic_type: string) {
    
  }
  
}