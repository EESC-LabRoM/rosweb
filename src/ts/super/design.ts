/// <reference path="../typings/tsd.d.ts" />

export class Design {

  public tabTopOffset: number = 0;
  public tabHeight: number = 0;

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
    this.tabHeight = totalHeight - usedHeight;
    this.tabTopOffset = usedHeight;
  }

  private _adjustContentHeight(): void {
    $("#content").height(this.tabHeight);
  }

  private _adjustWidgetsHeight(): void {
    // $(".jsWidgetsContainer").height(this.tabHeight).css("top", this.tabTopOffset);
    $(".jsMenuWidgetsSettings").height(this.tabHeight).css("top", this.tabTopOffset);
  }

  private _getTotalHeight(selector: string): number {
    let pad: number = parseInt($(selector).css("paddingTop")) + parseInt($(selector).css("paddingBottom"));
    let hei: number = $(selector).height();
    let bor: number = parseInt($(selector).css("borderTopWidth")) + parseInt($(selector).css("borderBottomWidth"));
    let totalHeight: number = pad + hei + bor;
    return totalHeight;
  }

}