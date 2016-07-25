/// <reference path="../../d/jquery.d.ts" />

export class EventsParent {
  
  public DelegateEvent(selector: string | Document | Window, event: string, method: () => void) {
    if(event == "resize") {
      $(selector).resize(method);
    }
    $(document).delegate(selector, event, method);
  }

}
