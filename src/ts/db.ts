import {Tab} from "./model/tab.ts";
import {Widget} from "./model/widget.ts";

export class Db {
  
  private TabCounter: number;
  private Tabs: Array<Tab>;
  
  private WidgetCounter: number;
  private Widgets: Array<Widget>;
  
  constructor() {
    this.TabCounter = 0;
    this.Tabs = new Array<Tab>();
  }
  
  public newTab(): Tab {
    let tab = new Tab();
    tab.id = ++this.TabCounter;
    this.Tabs.push(tab);
    return tab;
  }
  public getTab(id: number): Tab {
    for(let tab of this.Tabs) {
      if(tab.id == id) return tab;
    }
    return null;
  }
  public removeTab(tab_id: number): boolean {
    let index: number = 0;
    for(let tab of this.Tabs) {
      if(tab.id == tab_id) {
        this.Tabs.splice(index, 1);
        return true;
      }
      index++;
    }
    return false;
  }
  
}