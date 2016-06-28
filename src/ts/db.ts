import {Tab} from "./tab.ts";

export class Db {
  
  private tabCounter: number;
  
  constructor() {
    this.tabCounter = 0;
  }
  
  public newTab(): Tab {
    let tab = new Tab();
    tab.id = ++this.tabCounter;
    return tab;
  }
  
  public getTab(id: number): Tab {
    let tab = new Tab();
    tab.id = id;
    return tab;
  }
  
}