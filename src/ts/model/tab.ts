import {currentWorkspace} from "./workspace"
import {frontend} from "../super/frontend"

export class Tab {
  
  public id: number;
  public name: string;
  public active: boolean;
  
  constructor(name?: string) {
    currentWorkspace.create<Tab>(this);
    this.name = "Tab #" + this.id;
    this.setActive();

    frontend.newTab(this);
  }

  public setActive() {
    this.active = true;
    frontend.selectTab(this);
  }
  
}