/// <reference path="../typings/tsd.d.ts" />

export class Trigger {

  constructor() {
    
  }
  
  public newTab(): void  {
    $(".jsEventNewTab")[0].click();
  }

}