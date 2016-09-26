/// <reference path="../typings/tsd.d.ts" />

declare var MyApp: any;

class Lightbox {

  constructor() {
  }

  public CreateLightbox() {
    var lightboxHtml = MyApp.templates.lightbox();
    $(lightboxHtml).insertAfter("#footer");
  }

  public ShowLightbox(content?: string): void {
    $("#lightbox").html("");

    let wHeight: number = $(window).height();
    let wWidth: number = $(window).width();
    $("#lightboxBackground").css({ height: wHeight, width: wWidth }).fadeIn(500);

    if (content != undefined) {
      this.UpdateLightbox(content);
    }
  }

  public CloseLightbox(): void {
    $("#lightboxBackground").hide();
  }

  public UpdateLightbox(content: string): void {
    $("#lightbox").html(content);
    let wHeight: number = $(window).height();
    let wWidth: number = $(window).width();
    let width = $("#lightbox").width();
    let height = $("#lightbox").height();
    let left = (wWidth - width) / 2;
    let top = (wHeight - height) / 2;
    $("#lightbox").css({ top: top, left: left });
  }

}

export var lightbox: Lightbox = new Lightbox();
