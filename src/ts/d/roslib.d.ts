declare namespace ROSLIB {

  export class Ros {
    public constructor();
    public connect(url: string): void;
    public on(event: string, method: any) : void;
  }

}

declare module "roslib" {
    export = ROSLIB;
}