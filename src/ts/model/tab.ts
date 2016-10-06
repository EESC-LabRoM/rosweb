import {currentWorkspace} from "./workspace"

export class Tab {
  
  public id: number;
  public name: string;
  
  constructor(name?: string) {
    this.name = name;

    currentWorkspace.create<Tab>(this);
  }
  
}