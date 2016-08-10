/// <reference path="../typings/tsd.d.ts" />

export class Trigger {

  constructor() {
    
  }
  
  public newTab(): void  {
    $(".jsEventNewTab")[0].click();
  }

  public widgetSettings(widgetInstanceId: number): void {
    $(".jsWidgetSettings[data-widget-instance-id=" + widgetInstanceId + "]")[0].click();
  }

}