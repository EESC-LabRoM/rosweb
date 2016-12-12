import { WidgetInterface } from '../../ts/interface/widget';

class WidgetTopicPublisher implements WidgetInterface {
  public widgetInstanceId: number;
  public selector: string;

  public clbkCreated(): void {
    console.log("olá");
    // throw new Error('Not implemented yet.');
  }

  public clbkResized(): void {
    // throw new Error('Not implemented yet.');
  }

  public clbkMoved(): void {
    // throw new Error('Not implemented yet.');
  }

  public clbkTab(): void {
    // throw new Error('Not implemented yet.');
  }

  // selector callbacks
  public onChange(): void {

  }
}

window["WidgetTopicPublisher"] = WidgetTopicPublisher;
