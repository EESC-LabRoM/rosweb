import {currentWorkspace} from "./workspace"
import {frontend} from "../super/frontend"

export class Tab {
  
  public id: number;
  public name: string;
  public active: boolean;
  
  constructor(name?: string) {
    this.name = name;

    currentWorkspace.create<Tab>(this);

    frontend.newTab(this);
  }

  public setActive() {
    this.active = true;
    frontend.selectTab(this);
  }
  
}