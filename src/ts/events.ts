export class Events {
  
  constructor() {
    this.delegateClassEvent("jsEventNewTab", "click", this.newTab);
    
    /*
    for(let element of document.getElementsByClassName("jsEventNewTab")) {
      element.addEventListener("click", this.newTab);
    }
    */
  }
  
  private delegateClassEvent(className: string, eventName: string, method: () => void) {
    for(let element of document.getElementsByClassName("jsEventNewTab")) {
      element.addEventListener("click", method);
    }
  }
  
  public newTab() {
    alert("hello new tab event");
  }
  
}
