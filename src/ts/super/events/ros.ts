/// <reference path="../../d/jquery.d.ts" />
/// <reference path="../../d/roslib.d.ts" />

// Parent Class
import {EventsParent} from "./_parent.ts";

export class RosEvents extends EventsParent {

  public Ros: ROSLIB.Ros;

  constructor() {
    super();
    this.DeclareRosConnection();
    this.DelegateEvent(".jsRosConnectBtn", "click", this.Connect);
  }
  private DeclareRosConnection() : void {
    this.Ros = new ROSLIB.Ros();
    this.Ros.on("connection", this.OnRosConnection);
    this.Ros.on("close", this.OnRosClose);
    this.Ros.on("error", this.OnRosError);
  }

  public Connect = (e?: MouseEvent) => {
    let url : string = "ws://" + $(".jsRosUrl").val(); 
    this.Ros.connect(url);

    e.preventDefault();
  }
  public OnRosConnection() : void {
    
  }
  public OnRosClose() : void {
    
  }
  public OnRosError(error: any) : void {
    
  }

}