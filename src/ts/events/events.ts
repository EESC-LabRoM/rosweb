/// <reference path="../typings/tsd.d.ts" />

// import {db} from "../super/db.ts";
import {lightbox} from "../super/lightbox";

export class EventsParent {

  constructor() {
    this.DelegateEvent("#lightboxBackground", "click", this.HideLightbox);
    this.DelegateEvent("#lightbox", "click", this.Lightbox);
  }

  public nothing = (e?: MouseEvent) => {
    e.preventDefault();
  }

  public DelegateEvent(selector: string | Document | Window, event: string, method: () => void) {
    if (event == "resize") {
      $(selector).resize(method);
    }
    $(document).delegate(selector, event, method);
  }

  public DelegateElementCreated(selector: string, method: () => void) {
    $('body').on('DOMNodeInserted', selector, method);
  }

  public HideLightbox = (e?: MouseEvent) => {
    lightbox.CloseLightbox();
    e.preventDefault();
  }

  public Lightbox = (e?: MouseEvent) => {
    e.stopPropagation();
  }

}
