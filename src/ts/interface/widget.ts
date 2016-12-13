export interface WidgetInterface {

  widgetInstanceId:number;
  selector:string;

  clbkCreated():void;
  clbkResized():void;
  clbkMoved():void;
  clbkTab():void;

  setSelector(): void;

}