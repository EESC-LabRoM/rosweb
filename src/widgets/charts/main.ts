import * as roslib from 'ROSLIB';
///<reference path="../../ts/typings/tsd.d.ts" />

import { WidgetParent } from '../../ts/classmodel/widget'
import { Helper } from '../../ts/helpers/html';

declare var ros: ROSLIB.Ros;
declare var google: any;

class WidgetCharts extends WidgetParent {
  constructor(widgetInstanceId: number) {
    super(widgetInstanceId);
    this.topic = new ROSLIB.Topic({ ros: ros, name: "", messageType: "" });
  }
  // Mandatory callbacks
  clbkCreated(): void {
    this.chart_data = new google.visualization.DataTable();
    this.chart = new google.visualization.LineChart($(this.selector).find(".content .chart")[0]);
    this.chart_data.addColumn('number', 'Iteration');
    this.chart.draw(this.chart_data, this.chart_options);
    $(document).delegate(this.selector + " .jsWidgetChartResume", 'click', (e) => {
      $(this.selector + " .jsWidgetChartResume").attr("disabled", "disabled");
      $(this.selector + " .jsWidgetChartPause").removeAttr("disabled");
      this.resume();
    });
    $(document).delegate(this.selector + " .jsWidgetChartPause", 'click', (e) => {
      $(this.selector + " .jsWidgetChartPause").attr("disabled", "disabled");
      $(this.selector + " .jsWidgetChartResume").removeAttr("disabled");
      this.pause();
    });
    $(document).delegate(this.selector + " .jsWidgetChartReset", 'click', (e) => {
      $(this.selector + " .jsWidgetChartPause").attr("disabled", "disabled");
      $(this.selector + " .jsWidgetChartResume").removeAttr("disabled");
      this.clear();
    });
  }
  clbkResized(): void {
    this.chart.draw(this.chart_data, this.chart_options);
  }
  clbkMoved(): void {
  }
  clbkTab(): void {
  }
  clbkConfirm(): void {
  }

  // ROS topic selectors
  public ontopicselect(selectedTopic: string): void {
    this.topic.unsubscribe();
    this.topic.name = selectedTopic;
    this.plotCount = 0;
    this.chart_last_update = 0;
    if(this.chart_data.getNumberOfColumns() > 1) {
      this.chart_data.removeColumn(1);
    }
    this.chart_data.addColumn('number', selectedTopic);

    if (selectedTopic == "") return;
    ros.getTopicType(selectedTopic, (type) => {
      this.topic.messageType = type;
      this.topic.subscribe(this.topicCallback);
    }, function (e) {
      throw new Error(e);
    });
  }

  // button callbacks
  private status = true;
  resume(): void {
    this.status = true;
  }

  public interval: any;
  pause(): void {
    this.status = false;
  }

  clear(): void {
    this.chart_data.removeColumn(1);
    this.chart_data.addColumn('number', this.topic.name);
    this.plotCount = 0;
    this.chart.draw(this.chart_data, this.chart_options);
    this.status = false;
  }

  // ===== widget params =====
  public topicName: string;
  public topicEval: string;
  public topic: ROSLIB.Topic;
  private chart_last_update: number;
  private plotCount: number;
  private chart: any;
  private chart_data: any;
  private chart_data_array = [];
  private chart_options = {
        hAxis: {
          title: 'Iterations'
        },
        vAxis: {
          title: 'Value'
        },
        series: {
          1: {curveType: 'function'}
        }
      };
  topicCallback = (message: any): void => {
    if(this.status) {
      let datetime_now: number = Date.now();
      let period = 1000;
      let data = message;
      let value = parseFloat(eval(this.topicEval));
      let row = [this.plotCount, value];
      this.plotCount++;
      this.chart_data.addRows([row]);
      if(datetime_now - this.chart_last_update > period) {
        this.chart.draw(this.chart_data, this.chart_options);
        this.chart_last_update = datetime_now;
      }
    }
  }
}

window["WidgetCharts"] = WidgetCharts;
