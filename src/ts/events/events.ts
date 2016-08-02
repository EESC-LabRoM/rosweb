/// <reference path="../typings/tsd.d.ts" />

export class EventsParent {

  constructor() {
    
  }
  
  public nothing = (e?: MouseEvent) => {
    e.preventDefault();
  }
  
  public DelegateEvent(selector: string | Document | Window, event: string, method: () => void) {
    if(event == "resize") {
      $(selector).resize(method);
    }
    $(document).delegate(selector, event, method);
  }

  public DelegateElementCreated(insertedSelector: string, method: () => void) {
    $('body').on('DOMNodeInserted', insertedSelector, method);
  }

}
