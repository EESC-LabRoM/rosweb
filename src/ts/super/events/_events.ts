/// <reference path="../../d/jquery.d.ts" />

export class EventsParent {
  
  public DelegateEvent(selector: string, event: string, method: () => void) {
    $(document).delegate(selector, event, method);
  }

}
