/// <reference path="../typings/tsd.d.ts" />

// Parent Class
import { EventsParent } from "./events";
import { frontend } from "../super/frontend"

export class RosEvents extends EventsParent {

  public Ros: ROSLIB.Ros;
  public connected: boolean = false;

  constructor(ros: ROSLIB.Ros) {
    super();

    this.Ros = ros;
    this.Ros.on("connection", this.OnRosConnection);
    this.Ros.on("close", this.OnRosClose);
    this.Ros.on("error", this.OnRosError);
    this.DelegateEvent(".jsRosConnect", "click", this.Connect);
    this.DelegateEvent(".jsConfiguration", "click", this.Configuration);
  }

  public Connect = (e?: MouseEvent) => {
    if ($(".jsRosConnect").hasClass("loading")) {
      return;
    }
    $(".jsRosConnect").addClass("loading");

    if (!this.connected) {
      let url: string = $("#jsRosUrl").val();
      this.Ros.connect(url);
    } else {
      this.Ros.close();
    }
    if (e != undefined) e.preventDefault();
  }
  public Configuration = (e?: MouseEvent) => {
    frontend.ShowConfiguration();
    e.preventDefault();
  }
  private OnRosConnection = () => {
    this.connected = true;
    $(".jsRosConnect").addClass("active");
    $(".jsRosConnect").removeClass("loading");

    $(".jsRosConnect, #jsRosUrl, .jsConfiguration").removeClass("alert");
  }
  private OnRosClose = () => {
    this.connected = false;
    $(".jsRosConnect").removeClass("active");
    $(".jsRosConnect").removeClass("loading");
  }
  private OnRosError = (error: any) => {
    this.Ros.close();
    this.connected = false;
    $(".jsRosConnect").removeClass("active");
    $(".jsRosConnect").removeClass("loading");

    $(".jsRosConnect, #jsRosUrl, .jsConfiguration").addClass("alert");
    console.log(error);
  }

}