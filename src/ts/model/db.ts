import {Tab} from "./tab"
import {WidgetInstance} from "./widget_instance"
import {Workspace} from "./workspace"

export class DbModel {

  constructor() {

  }


  // Tab
  public TabCounter: number;
  public Tabs: Array<Tab>;
  public newTab(): Tab {
    let tab = new Tab();
    tab.id = ++this.TabCounter;
    this.Tabs.push(tab);
    return tab;
  }
  public getTab(id: number): Tab {
    for (let tab of this.Tabs) {
      if (tab.id == id) return tab;
    }
    return null;
  }
  public removeTab(tab_id: number): boolean {
    let index: number = 0;
    for (let tab of this.Tabs) {
      if (tab.id == tab_id) {
        this.Tabs.splice(index, 1);
        return true;
      }
      index++;
    }
    return false;
  }
  
  public Workspaces: Workspace[];

}
