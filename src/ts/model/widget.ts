/// <reference path="../typings/tsd.d.ts" />

import {frontend} from "../super/frontend"
import {currentWorkspace} from "./workspace"

export class Widget {

  public id: number;
  public name: string;
  public image_url: string;
  public url: string;
  public alias: string;
  public html: string;

  constructor(name, url, alias) {
    this.name = name;
    this.url = url;
    this.alias = alias;
    currentWorkspace.create<Widget>(this);

    frontend.newWidget(this);
  }

}
