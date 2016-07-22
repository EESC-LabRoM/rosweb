/// <reference path="../d/jquery.d.ts" />

export class Design {

  public tabTopOffset: number = 0;

  constructor() {
    this.adjustWindowResize();
  }

  public adjustWindowResize(): void {
    this._calculateTabTopOffset();
    this._adjustContentHeight();
    this._adjustWidgetsHeight();
  }

  private _calculateTabTopOffset(): void {
    let totalHeight = $(window).height();
    let usedHeight = this._getTotalHeight("#header1") + this._getTotalHeight("#header2");
    this.tabTopOffset = totalHeight - usedHeight;
  }

  private _adjustContentHeight(): void {
    $("#content").height(this.tabTopOffset);
  }

  private _adjustWidgetsHeight(): void {
    $(".cssWidgetsContainer").height(this.tabTopOffset);
  }

  private _getTotalHeight(selector: string): number {
    let pad: number = parseInt($(selector).css("paddingTop")) + parseInt($(selector).css("paddingBottom"));
    let hei: number = parseInt($(selector).css("height"));
    let bor: number = parseInt($(selector).css("borderTopWidth")) + parseInt($(selector).css("borderBottomWidth")); 
    let totalHeight: number = pad + hei + bor;
    return totalHeight;
  }

}