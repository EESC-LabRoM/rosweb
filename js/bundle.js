(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
const lightbox_ts_1 = require("../super/lightbox.ts");
class EventsParent {
    constructor() {
        this.nothing = (e) => {
            e.preventDefault();
        };
        this.HideLightbox = (e) => {
            lightbox_ts_1.lightbox.CloseLightbox();
            e.preventDefault();
        };
        this.Lightbox = (e) => {
            e.stopPropagation();
        };
        this.DelegateEvent("#lightboxBackground", "click", this.HideLightbox);
        this.DelegateEvent("#lightbox", "click", this.Lightbox);
    }
    DelegateEvent(selector, event, method) {
        if (event == "resize") {
            $(selector).resize(method);
        }
        $(document).delegate(selector, event, method);
    }
    DelegateElementCreated(selector, method) {
        $('body').on('DOMNodeInserted', selector, method);
    }
}
exports.EventsParent = EventsParent;

},{"../super/lightbox.ts":17}],2:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// Parent Class
const events_ts_1 = require("./events.ts");
class RosEvents extends events_ts_1.EventsParent {
    constructor(ros) {
        super();
        this.connected = false;
        this.Connect = (e) => {
            if ($(".jsRosConnect").hasClass("loading")) {
                return;
            }
            $(".jsRosConnect").addClass("loading");
            if (!this.connected) {
                let url = "ws://" + $(".jsRosUrl").val();
                this.Ros.connect(url);
            }
            else {
                this.Ros.close();
            }
            e.preventDefault();
        };
        this.OnRosConnection = () => {
            this.connected = true;
            $(".jsRosConnect").addClass("active");
            $(".jsRosConnect").removeClass("loading");
        };
        this.OnRosClose = () => {
            this.connected = false;
            $(".jsRosConnect").removeClass("active");
            $(".jsRosConnect").removeClass("loading");
        };
        this.OnRosError = (error) => {
            this.Ros.close();
            this.connected = false;
            $(".jsRosConnect").removeClass("active");
            $(".jsRosConnect").removeClass("loading");
            console.log(error);
        };
        this.Ros = ros;
        this.Ros.on("connection", this.OnRosConnection);
        this.Ros.on("close", this.OnRosClose);
        this.Ros.on("error", this.OnRosError);
        this.DelegateEvent(".jsRosConnect", "click", this.Connect);
    }
}
exports.RosEvents = RosEvents;

},{"./events.ts":1}],3:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// Parent Class
const events_ts_1 = require("./events.ts");
// Super classes
const db_ts_1 = require("../super/db.ts");
const design_ts_1 = require("../super/design.ts");
const frontend_ts_1 = require("../super/frontend.ts");
class TabEvents extends events_ts_1.EventsParent {
    constructor() {
        super();
        this._windowResized = (e) => {
            this.Design.adjustWindowResize();
        };
        this.newTab = (e) => {
            this._newTab();
            e.preventDefault();
        };
        this.selectTab = (e) => {
            let tabId = parseInt($(e.toElement).attr("data-tab-id"));
            let tab = db_ts_1.db.getTab(tabId);
            this._selectTab(tab);
            e.preventDefault();
        };
        this.closeTab = (e) => {
            let tabId = parseInt($(e.toElement).attr("data-tab-id"));
            if (confirm("Are you sure you want to close tab #" + tabId + " ?")) {
                this._closeTab(tabId);
            }
            e.preventDefault();
        };
        this.Frontend = new frontend_ts_1.Frontend();
        this.Design = new design_ts_1.Design();
        // render list
        this.Frontend.widgetsList(db_ts_1.db.Widgets);
        // Resize Events
        this.DelegateEvent(window, "resize", this._windowResized);
        // Left Click Events
        this.DelegateEvent(".jsEventNothing", "click", this.nothing);
        this.DelegateEvent(".jsEventNewTab", "click", this.newTab);
        this.DelegateEvent(".jsEventTab", "click", this.selectTab);
        this.DelegateEvent(".jsEventCloseTab", "click", this.closeTab);
        this.DelegateEvent(".jsRosweb", "click", (e) => {
            console.log(db_ts_1.db);
            e.preventDefault();
        });
    }
    _newTab() {
        var tab = db_ts_1.db.newTab();
        tab = this.Frontend.formTab(tab);
        this.Frontend.newTab(tab);
        this._selectTab(tab);
    }
    _selectTab(tab) {
        this.Frontend.selectTab(tab);
    }
    _closeTab(tabId) {
        db_ts_1.db.removeTab(tabId);
        this.Frontend.closeTab(tabId);
    }
}
exports.TabEvents = TabEvents;

},{"../super/db.ts":13,"../super/design.ts":14,"../super/frontend.ts":15,"./events.ts":1}],4:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// Super
const frontend_ts_1 = require("../super/frontend.ts");
const db_ts_1 = require("../super/db.ts");
// Parent Class
const events_ts_1 = require("./events.ts");
class WidgetEvents extends events_ts_1.EventsParent {
    constructor(ros) {
        super();
        this.Frontend = new frontend_ts_1.Frontend();
        this.widgetMenu = (e) => {
            this._widgetMenu();
            e.preventDefault();
        };
        this.widgetItem = (e) => {
            let widgetAlias = $(e.toElement).attr("data-widget-alias");
            this._widgetItem(widgetAlias);
            this._widgetMenu();
            e.preventDefault();
        };
        this.Ros = ros;
        this.DelegateEvent(".jsEventWidgetsMenu", "click", this.widgetMenu);
        this.DelegateEvent(".jsEventWidgetItem", "click", this.widgetItem);
        this.DelegateEvent(".jsWidgetContainer a", "click", this.nothing);
    }
    _widgetMenu() {
        this.Frontend.showWidgetsMenu();
    }
    _widgetItem(widgetAlias) {
        let widget = db_ts_1.db.getWidgetByAlias(widgetAlias);
        let widgetInstance = db_ts_1.db.newWidgetInstance(widget);
        this.Frontend.insertWidgetInstance(widgetInstance, widgetInstance.WidgetCallbackClass.clbkCreated);
    }
}
exports.WidgetEvents = WidgetEvents;

},{"../super/db.ts":13,"../super/frontend.ts":15,"./events.ts":1}],5:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// Super
const frontend_ts_1 = require("../super/frontend.ts");
const db_ts_1 = require("../super/db.ts");
// Parent Class
const events_ts_1 = require("./events.ts");
class WidgetInstanceEvents extends events_ts_1.EventsParent {
    constructor(ros) {
        super();
        this.WidgetConfirm = (e) => {
            $(e.toElement).closest(".jsWidgetContainer").attr("data-widget-conf", "0");
            e.preventDefault();
        };
        this.WidgetDelete = (e) => {
            $(e.toElement).closest(".jsWidgetContainer").remove();
            e.preventDefault();
        };
        this.WidgetSettings = (e) => {
            let widgetInstanceId = parseInt($(e.toElement).attr("data-widget-instance-id"));
            this._WidgetSettings(widgetInstanceId);
            e.preventDefault();
        };
        this.WidgetContainerDblClick = (e) => {
            let widgetInstanceId = parseInt($(e.toElement).closest(".jsWidgetContainer").attr("data-widget-instance-id"));
            this.ToggleMovable();
            if ($(".jsToggleMovable").hasClass("active")) {
                this._WidgetSettings(widgetInstanceId);
            }
            document.getSelection().removeAllRanges();
            e.preventDefault();
        };
        this.WidgetSettingsRefresh = (e) => {
            this.Frontend.LoadingLink($(".jsWidgetSettingsRefresh")[0]);
            $(".jsRosTopicSelector").attr("disabled", "disabled");
            this._WidgetSettingsRefresh();
            e.preventDefault();
        };
        this.WidgetSettingsConfirm = (e) => {
            // manage ros data
            this._WidgetSettingsConfirmSubscriptions();
            this._WidgetSettingsConfirmRosParams();
            this._WidgetSettingsConfirmRosServices();
            // manage params
            this._WidgetSettingsConfirmParams();
            // frontend action
            this.Frontend.HideWidgetSettings();
            e.preventDefault();
        };
        this.WidgetSettingsCancel = (e) => {
            this.Frontend.HideWidgetSettings();
            e.preventDefault();
        };
        this.WidgetSettingsRemove = (e) => {
            let widgetInstanceId = parseInt($("#widgetSettings").val());
            $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]").remove();
            this.Frontend.HideWidgetSettings();
            e.preventDefault();
        };
        this.ToggleMovable = (e) => {
            $(".jsToggleMovable").toggleClass("active");
            if ($(".jsToggleMovable").hasClass("active")) {
                $(".jsWidgetContainer").attr("data-widget-conf", "1");
            }
            else {
                $(".jsWidgetContainer").attr("data-widget-conf", "0");
                this.Frontend.HideWidgetSettings();
            }
            if (e != undefined)
                e.preventDefault();
        };
        this.MouseDown = (e) => {
            if ($(e.toElement).hasClass("jsWidgetResize")) {
                this.toMove = false;
                this.toResize = true;
            }
            else {
                this.toMove = true;
                this.toResize = false;
            }
            $(".jsWidgetContainer").css("z-index", "20");
            this.widgetInstanceId = parseInt($(e.toElement).closest(".jsWidgetContainer").attr("data-widget-instance-id"));
            $(e.toElement).closest(".jsWidgetContainer").css("z-index", "30");
            this.lastX = e.pageX;
            this.lastY = e.pageY;
        };
        this.MouseMove = (e) => {
            if (parseInt($(e.toElement).closest(".jsWidgetContainer").attr("data-widget-instance-id")) == this.widgetInstanceId) {
                if (this.toMove) {
                    document.getSelection().removeAllRanges();
                    this._WidgetMove(e);
                }
                if (this.toResize) {
                    this._WidgetResize(e);
                }
            }
            else {
                if (this.toResize) {
                    this._WidgetResize(e);
                }
                else {
                    this.widgetInstanceId = 0;
                }
            }
            this.lastX = e.pageX;
            this.lastY = e.pageY;
        };
        this.MouseUp = (e) => {
            this.widgetInstanceId = 0;
            this.toMove = this.toResize = false;
            $(".jsWidgetContainer").css("z-index", "20");
        };
        this.Ros = ros;
        this.Frontend = new frontend_ts_1.Frontend();
        // Settings
        this.DelegateEvent(".jsWidgetConfirm", "click", this.WidgetConfirm);
        this.DelegateEvent(".jsWidgetDelete", "click", this.WidgetDelete);
        this.DelegateEvent(".jsWidgetSettings", "click", this.WidgetSettings);
        this.DelegateEvent(".jsWidgetContainer", "dblclick", this.WidgetContainerDblClick);
        this.DelegateEvent(".jsWidgetSettingsConfirm", "click", this.WidgetSettingsConfirm);
        this.DelegateEvent(".jsWidgetSettingsCancel", "click", this.WidgetSettingsCancel);
        this.DelegateEvent(".jsWidgetSettingsRefresh", "click", this.WidgetSettingsRefresh);
        this.DelegateEvent(".jsWidgetSettingsRemove", "click", this.WidgetSettingsRemove);
        // Move and Resize
        this.DelegateEvent(".jsToggleMovable", "click", this.ToggleMovable);
        this.DelegateEvent(".jsWidgetContainer[data-widget-conf='1']", "mousedown", this.MouseDown);
        this.DelegateEvent(document, "mousemove", this.MouseMove);
        this.DelegateEvent(document, "mouseup", this.MouseUp);
    }
    ;
    _WidgetSettings(widgetInstanceId) {
        $("#widgetSettings").val(widgetInstanceId);
        $(".jsSettingsSelection").html("");
        // generate fields
        this._WidgetSettingsSubscriptions(widgetInstanceId);
        this._WidgetSettingsRosParams(widgetInstanceId);
        this._WidgetSettingsRosServices(widgetInstanceId);
        this._WidgetSettingsParams(widgetInstanceId);
        // frontend actions
        this.Frontend.ShowWidgetSettings();
        this._WidgetSettingsRefresh();
    }
    _WidgetSettingsSubscriptions(widgetInstanceId) {
        $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-ros-topic=1]").each(function (k, v) {
            var html = MyApp.templates.rosTopicSelector({
                widget_instance_id: widgetInstanceId,
                ros_topic_id: $(v).attr("data-ros-topic-id"),
                ros_topic_chng: $(v).attr("data-ros-topic-chng"),
                ros_topic_desc: $(v).attr("data-ros-topic-desc"),
                ros_topic_type: $(v).attr("data-ros-topic-type")
            });
            $(".jsSettingsSelection").append(html);
        });
    }
    ;
    _WidgetSettingsRosParams(widgetInstanceId) {
        $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-ros-param=1]").each(function (k, v) {
            var html = MyApp.templates.rosParamSelector({
                widget_instance_id: widgetInstanceId,
                ros_param_id: $(v).attr("data-ros-param-id"),
                ros_param_desc: $(v).attr("data-ros-param-desc"),
                ros_param_chng: $(v).attr("data-ros-param-chng")
            });
            $(".jsSettingsSelection").append(html);
        });
    }
    ;
    _WidgetSettingsRosServices(widgetInstanceId) {
        $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-ros-service=1]").each(function (k, v) {
            var html = MyApp.templates.rosServiceSelector({
                widget_instance_id: widgetInstanceId,
                ros_service_id: $(v).attr("data-ros-service-id"),
                ros_service_desc: $(v).attr("data-ros-service-desc"),
                ros_service_chng: $(v).attr("data-ros-service-chng")
            });
            $(".jsSettingsSelection").append(html);
        });
    }
    ;
    _WidgetSettingsParams(widgetInstanceId) {
        $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-wdgt-param=1]").each(function (k, v) {
            var html = MyApp.templates.wdgtParamField({
                widget_instance_id: widgetInstanceId,
                widget_param_id: $(v).attr("data-widget-param-id"),
                widget_param_desc: $(v).attr("data-widget-param-desc"),
                widget_param_var: $(v).attr("data-widget-param-var"),
                default_value: $(v).attr("data-widget-param-value")
            });
            $(".jsSettingsSelection").append(html);
        });
    }
    ;
    _WidgetSettingsRefresh() {
        this._WidgetSettingsRefreshTopics();
    }
    ;
    _WidgetSettingsRefreshTopics() {
        this.Ros.getTopics((topicsResponse) => {
            this.Frontend.UpdateRosTopicSelectors(topicsResponse);
            this._WidgetSettingsRefreshParams();
        }, () => function (topicsError) {
            alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
            console.log(topicsError);
        });
    }
    ;
    _WidgetSettingsRefreshParams() {
        this.Ros.getParams((paramsResponse) => {
            this.Frontend.UpdateRosParamSelectors(paramsResponse);
            this._WidgetSettingsRefreshsServices();
        }, () => function (paramsError) {
            alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
            console.log(paramsError);
        });
    }
    ;
    _WidgetSettingsRefreshsServices() {
        this.Ros.getServices((servicesResponse) => {
            this.Frontend.UpdateRosServiceSelectors(servicesResponse);
            this.Frontend.LoadingLink($(".jsWidgetSettingsRefresh")[0], false);
        }, () => function (servicesError) {
            alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
            console.log(servicesError);
        });
    }
    ;
    _WidgetSettingsConfirmSubscriptions() {
        $(".jsRosTopicSelector").each((index, elem) => {
            let topic_name = $(elem).val();
            let widgetInstanceId = parseInt($(elem).attr("data-widget-instance-id"));
            let widgetInstance = db_ts_1.db.getWidgetInstance(widgetInstanceId);
            let topicChangeCallback = $(elem).attr("data-ros-topic-chng");
            widgetInstance.WidgetCallbackClass[topicChangeCallback](topic_name);
            let rosTopicId = $(elem).attr("data-ros-topic-id");
            let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
            let htmlMeta = $(htmlWidgetInstance).find("meta[data-ros-topic-id=" + rosTopicId + "]");
            $(htmlMeta).attr("data-ros-topic-slctd", topic_name);
        });
    }
    ;
    _WidgetSettingsConfirmRosParams() {
        $(".jsRosParamSelector").each((index, elem) => {
            let widgetInstanceId = parseInt($(elem).attr("data-widget-instance-id"));
            let widgetInstance = db_ts_1.db.getWidgetInstance(widgetInstanceId);
            let paramChangeCallback = $(elem).attr("data-ros-param-chng");
            let paramSelected = $(elem).val();
            widgetInstance.WidgetCallbackClass[paramChangeCallback](paramSelected);
            let rosParamId = $(elem).attr("data-ros-param-id");
            let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
            let htmlMeta = $(htmlWidgetInstance).find("meta[data-ros-param-id=" + rosParamId + "]");
            $(htmlMeta).attr("data-ros-param-slctd", paramSelected);
        });
    }
    ;
    _WidgetSettingsConfirmRosServices() {
        $(".jsRosServiceSelector").each((index, elem) => {
            let widgetInstanceId = parseInt($(elem).attr("data-widget-instance-id"));
            let widgetInstance = db_ts_1.db.getWidgetInstance(widgetInstanceId);
            let serviceChangeCallback = $(elem).attr("data-ros-service-chng");
            let serviceSelected = $(elem).val();
            widgetInstance.WidgetCallbackClass[serviceChangeCallback](serviceSelected);
            let rosServiceId = $(elem).attr("data-ros-service-id");
            let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
            let htmlMeta = $(htmlWidgetInstance).find("meta[data-ros-service-id=" + rosServiceId + "]");
            $(htmlMeta).attr("data-ros-service-slctd", serviceSelected);
        });
    }
    _WidgetSettingsConfirmParams() {
        $(".jsWidgetParam").each((index, elem) => {
            let widgetInstanceId = parseInt($(elem).attr("data-widget-instance-id"));
            let widgetInstance = db_ts_1.db.getWidgetInstance(widgetInstanceId);
            let varName = $(elem).attr("data-widget-param-var");
            let varValue = $(elem).val();
            widgetInstance.WidgetCallbackClass[varName] = varValue;
            let widgetParamId = $(elem).attr("data-widget-param-id");
            let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
            let htmlMeta = $(htmlWidgetInstance).find("meta[data-widget-param-id=" + widgetParamId + "]");
            $(htmlMeta).attr("data-widget-param-value", varValue);
        });
    }
    ;
    _WidgetResize(e) {
        let d = this._GetMouseDistance(e);
        let width = $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width();
        let height = $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height();
        let size = this._ApplySizeBoundaries({ x: width + d.x, y: height + d.y });
        $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width(size.x);
        $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height(size.y);
        let widgetInstance = db_ts_1.db.getWidgetInstance(this.widgetInstanceId);
        if (widgetInstance.WidgetCallbackClass.clbkResized != undefined) {
            widgetInstance.WidgetCallbackClass.clbkResized(size.x, size.y);
        }
        widgetInstance.size.x = size.x;
        widgetInstance.size.y = size.y;
    }
    ;
    _ApplySizeBoundaries(size) {
        let widthMin = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "'] .ros-widget").attr("data-min-width"));
        let widthMax = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "'] .ros-widget").attr("data-max-width"));
        let heightMin = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "'] .ros-widget").attr("data-min-height"));
        let heightMax = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "'] .ros-widget").attr("data-max-height"));
        if (size.x > widthMax) {
            size.x = widthMax;
        }
        if (size.x < widthMin) {
            size.x = widthMin;
        }
        if (size.y > heightMax) {
            size.y = heightMax;
        }
        if (size.y < heightMin) {
            size.y = heightMin;
        }
        return size;
    }
    ;
    _WidgetMove(e) {
        let d = this._GetMouseDistance(e);
        let left = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left"));
        let top = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top"));
        let pos = this._ApplyPositionBoundaries({ x: left + d.x, y: top + d.y });
        $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left", pos.x);
        $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top", pos.y);
        let widgetInstance = db_ts_1.db.getWidgetInstance(this.widgetInstanceId);
        if (widgetInstance.WidgetCallbackClass.clbkMoved != undefined) {
            widgetInstance.WidgetCallbackClass.clbkMoved(pos.x, pos.y);
        }
        widgetInstance.position.x = pos.x;
        widgetInstance.position.y = pos.y;
    }
    ;
    _ApplyPositionBoundaries(pos) {
        let offset = $(".jsTabContent.jsShow").offset();
        let xMin = offset.left + 1;
        let yMin = offset.top;
        let xMax = xMin + $(".jsTabContent.jsShow").width() - $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width() - 1;
        let yMax = yMin + $(".jsTabContent.jsShow").height() - $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height() - 1;
        if (pos.x > xMax) {
            pos.x = xMax;
        }
        if (pos.x < xMin) {
            pos.x = xMin;
        }
        if (pos.y > yMax) {
            pos.y = yMax;
        }
        if (pos.y < yMin) {
            pos.y = yMin;
        }
        return pos;
    }
    ;
    _GetMouseDistance(e) {
        return { x: e.pageX - this.lastX, y: e.pageY - this.lastY };
    }
    ;
}
exports.WidgetInstanceEvents = WidgetInstanceEvents;

},{"../super/db.ts":13,"../super/frontend.ts":15,"./events.ts":1}],6:[function(require,module,exports){
"use strict";
const storage_ts_1 = require("../super/storage.ts");
const db_ts_1 = require("../super/db.ts");
const lightbox_ts_1 = require("../super/lightbox.ts");
const events_ts_1 = require("./events.ts");
const workspace_ts_1 = require("../model/workspace.ts");
class WorkspaceEvents extends events_ts_1.EventsParent {
    constructor() {
        super();
        this.OpenWorkspace = (e) => {
            this._OpenWorkspace();
            e.preventDefault();
        };
        this.SaveWorkspace = (e) => {
            if (window.confirm("Save a new workspace?")) {
                this._SaveWorkspace();
            }
            else {
            }
            e.preventDefault();
        };
        this.LoadWorkspace = (e) => {
            let workspace_id = parseInt($(e.toElement).attr("data-workspace-id"));
            this._LoadWorkspace(workspace_id);
            e.preventDefault();
        };
        this.RemoveWorkspace = (e) => {
            let workspace_id = parseInt($(e.toElement).attr("data-workspace-id"));
            let workspace = storage_ts_1.storage.GetWorkspace(workspace_id);
            this._RemoveWorkspace(workspace);
            e.preventDefault();
        };
        this.DelegateEvent(".jsOpenWorkspace", "click", this.OpenWorkspace);
        this.DelegateEvent(".jsSaveWorkspace", "click", this.SaveWorkspace);
        this.DelegateEvent(".jsLoadWorkspace", "click", this.LoadWorkspace);
        this.DelegateEvent(".jsRemoveWorkspace", "click", this.RemoveWorkspace);
    }
    _OpenWorkspace() {
        let workspaces = storage_ts_1.storage.GetWorkspaces();
        let html = MyApp.templates.workspaceList(workspaces);
        lightbox_ts_1.lightbox.ShowLightbox(html);
    }
    _SaveWorkspace() {
        let workspace = new workspace_ts_1.Workspace();
        workspace = storage_ts_1.storage.NewWorkspace($("#jsWorkspaceName").val());
        storage_ts_1.storage.SaveWorkspace(workspace);
    }
    _LoadWorkspace(workspace_id) {
        let workspace = storage_ts_1.storage.GetWorkspace(workspace_id);
        db_ts_1.db.loadWorkspace(workspace);
        lightbox_ts_1.lightbox.CloseLightbox();
    }
    _RemoveWorkspace(workspace) {
        if (window.confirm("Are you sure you want to remove workspace #" + workspace.id + " (" + workspace.id + ") ?")) {
            let html = MyApp.templates.workspaceList(storage_ts_1.storage.RemoveWorkspace(workspace.id));
            lightbox_ts_1.lightbox.UpdateLightbox(html);
        }
        else {
        }
    }
}
exports.WorkspaceEvents = WorkspaceEvents;

},{"../model/workspace.ts":12,"../super/db.ts":13,"../super/lightbox.ts":17,"../super/storage.ts":19,"./events.ts":1}],7:[function(require,module,exports){
/// <reference path="./typings/tsd.d.ts" />
"use strict";
// Events
const tab_ts_1 = require("./events/tab.ts");
const widget_ts_1 = require("./events/widget.ts");
const widget_instance_ts_1 = require("./events/widget_instance.ts");
const ros_ts_1 = require("./events/ros.ts");
const workspace_ts_1 = require("./events/workspace.ts");
// Super
const db_ts_1 = require("./super/db.ts");
const lightbox_ts_1 = require("./super/lightbox.ts");
const storage_ts_1 = require("./super/storage.ts");
const frontend_ts_1 = require("./super/frontend.ts");
exports.ros = new ROSLIB.Ros("");
function init() {
    window["ros"] = exports.ros;
    insertWidgets();
    events(exports.ros);
    $(document).ready(function () {
        lightbox_ts_1.lightbox.CreateLightbox();
    });
    storage_ts_1.storage.Init();
}
function events(ros) {
    let tabEvents = new tab_ts_1.TabEvents();
    let widgetEvents = new widget_ts_1.WidgetEvents(ros);
    let widgetInstanceEvents = new widget_instance_ts_1.WidgetInstanceEvents(ros);
    let rosEvents = new ros_ts_1.RosEvents(ros);
    let workspace = new workspace_ts_1.WorkspaceEvents();
}
function insertWidgets() {
    // load list of available widgets
    let count = 1;
    let widget = db_ts_1.db.newWidget();
    widget.id = count;
    widget.name = "Topic Viewer";
    widget.alias = "TopicViewer";
    widget.url = "./widgets/topic_viewer";
    count++;
    widget = db_ts_1.db.newWidget();
    widget.id = count;
    widget.name = "Param Viewer";
    widget.alias = "ParamViewer";
    widget.url = "./widgets/param_viewer";
    count++;
    widget = db_ts_1.db.newWidget();
    widget.id = count;
    widget.name = "Service Viewer";
    widget.alias = "ServiceViewer";
    widget.url = "./widgets/service_viewer";
    count++;
    widget = db_ts_1.db.newWidget();
    widget.id = count;
    widget.name = "Google Maps GPS Viewer";
    widget.alias = "GoogleMapsGpsViewer";
    widget.url = "./widgets/gmaps_gps";
    count++;
    widget = db_ts_1.db.newWidget();
    widget.id = count;
    widget.name = "Camera Viewer";
    widget.alias = "CameraViewer";
    widget.url = "./widgets/camera_viewer";
    count++;
    widget = db_ts_1.db.newWidget();
    widget.id = count;
    widget.name = "URDF Viewer";
    widget.alias = "UrdfViewer";
    widget.url = "./widgets/urdf_viewer";
    count++;
    widget = db_ts_1.db.newWidget();
    widget.id = count;
    widget.name = "LaserScan Viewer";
    widget.alias = "LaserScanViewer";
    widget.url = "./widgets/laser_scan_viewer";
    count++;
    // insert Widgets JS and CSS tags
    let frontend = new frontend_ts_1.Frontend();
    frontend.InsertWidgetsTags();
}
init();

},{"./events/ros.ts":2,"./events/tab.ts":3,"./events/widget.ts":4,"./events/widget_instance.ts":5,"./events/workspace.ts":6,"./super/db.ts":13,"./super/frontend.ts":15,"./super/lightbox.ts":17,"./super/storage.ts":19}],8:[function(require,module,exports){
"use strict";
class ROSWeb {
    constructor() {
        this.Workspaces = new Array();
    }
}
exports.ROSWeb = ROSWeb;

},{}],9:[function(require,module,exports){
"use strict";
class Tab {
    constructor(name) {
        if (name) {
            this.name = name;
        }
    }
}
exports.Tab = Tab;

},{}],10:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
class Widget {
    constructor() {
    }
}
exports.Widget = Widget;

},{}],11:[function(require,module,exports){
"use strict";
const instance_loader_ts_1 = require("../super/instance_loader.ts");
class WidgetInstance {
    constructor(id, widget) {
        this.id = id;
        this.Widget = widget;
        this.Subscriptions = new Array();
        this.position = { x: 0, y: 0 };
        this.size = { x: 0, y: 0 };
        this.WidgetCallbackClass = instance_loader_ts_1.instance_loader.getInstance(window, "Widget" + this.Widget.alias.charAt(0).toUpperCase() + this.Widget.alias.slice(1), this.id);
    }
}
exports.WidgetInstance = WidgetInstance;

},{"../super/instance_loader.ts":16}],12:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
class Workspace {
    constructor() {
    }
}
exports.Workspace = Workspace;

},{}],13:[function(require,module,exports){
"use strict";
const tab_ts_1 = require("../model/tab.ts");
const widget_ts_1 = require("../model/widget.ts");
const widget_instance_ts_1 = require("../model/widget_instance.ts");
const frontend_ts_1 = require("../super/frontend.ts");
class Db {
    constructor() {
        this.Frontend = new frontend_ts_1.Frontend();
        this.TabCounter = 0;
        this.Tabs = new Array();
        this.WidgetCounter = 0;
        this.Widgets = new Array();
        this.WidgetInstanceCounter = 0;
        this.WidgetInstances = new Array();
    }
    saveAll() {
    }
    // Loading workspace
    loadWorkspace(workspace) {
        this.TabCounter = workspace.db.TabCounter;
        this.Tabs = workspace.db.Tabs;
        this._ClearWorkspace();
        this._GenerateWorkspace(workspace.db.WidgetInstances);
    }
    _ClearWorkspace() {
        $(".jsTab, .jsTabContent").remove();
    }
    _GenerateWorkspace(widgetInstances) {
        this.Tabs.forEach((tab, index) => {
            this.Frontend.newTab(tab);
            this.Frontend.selectTab(tab);
            widgetInstances.forEach((widgetInstance, index) => {
                if (widgetInstance.Tab.id == tab.id) {
                    let widget = exports.db.getWidgetByAlias(widgetInstance.Widget.alias);
                    let newWidgetInstance = exports.db.newWidgetInstance(widget);
                    this.Frontend.insertWidgetInstance(newWidgetInstance, () => {
                        newWidgetInstance.WidgetCallbackClass.clbkCreated();
                        this.Frontend.setWidgetInstancePosition(newWidgetInstance, widgetInstance.position);
                        this.Frontend.setWidgetInstanceSize(newWidgetInstance, widgetInstance.size);
                    });
                }
            });
        });
    }
    newTab() {
        let tab = new tab_ts_1.Tab();
        tab.id = ++this.TabCounter;
        this.Tabs.push(tab);
        return tab;
    }
    getTab(id) {
        for (let tab of this.Tabs) {
            if (tab.id == id)
                return tab;
        }
        return null;
    }
    removeTab(tab_id) {
        let index = 0;
        for (let tab of this.Tabs) {
            if (tab.id == tab_id) {
                this.Tabs.splice(index, 1);
                return true;
            }
            index++;
        }
        return false;
    }
    newWidget() {
        let widget = new widget_ts_1.Widget();
        widget.id = ++this.WidgetCounter;
        this.Widgets.push(widget);
        return widget;
    }
    setWidget(widget) {
        return;
    }
    getWidget(id) {
        for (let widget of this.Widgets) {
            if (widget.id == id)
                return widget;
        }
        return null;
    }
    getWidgetByAlias(widgetAlias) {
        let widget = new widget_ts_1.Widget();
        let toReturn = null;
        this.Widgets.forEach(widget => {
            if (widget.alias === widgetAlias) {
                toReturn = widget;
            }
        });
        if (toReturn === null)
            throw "Error: Widget alias not found!";
        return toReturn;
    }
    removeWidget(widget_id) {
        let index = 0;
        for (let widget of this.Widgets) {
            if (widget.id == widget_id) {
                this.Widgets.splice(index, 1);
                return true;
            }
            index++;
        }
        return false;
    }
    newWidgetInstance(widget) {
        let id = ++this.WidgetInstanceCounter;
        let widgetInstance = new widget_instance_ts_1.WidgetInstance(id, widget);
        this.WidgetInstances.push(widgetInstance);
        return widgetInstance;
    }
    getWidgetInstance(id) {
        for (let widgetInstance of this.WidgetInstances) {
            if (widgetInstance.id == id)
                return widgetInstance;
        }
        return null;
    }
    removeWidgetInstance(widgetInstance_id) {
        let index = 0;
        for (let widgetInstance of this.WidgetInstances) {
            if (widgetInstance.id == widgetInstance_id) {
                this.WidgetInstances.splice(index, 1);
                return true;
            }
            index++;
        }
        return false;
    }
}
exports.Db = Db;
exports.db = new Db();

},{"../model/tab.ts":9,"../model/widget.ts":10,"../model/widget_instance.ts":11,"../super/frontend.ts":15}],14:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
class Design {
    constructor() {
        this.tabTopOffset = 0;
        this.tabHeight = 0;
        this.adjustWindowResize();
    }
    adjustWindowResize() {
        this._calculateTabTopOffset();
        this._adjustContentHeight();
        this._adjustWidgetsHeight();
    }
    _calculateTabTopOffset() {
        let totalHeight = $(window).height();
        let usedHeight = this._getTotalHeight("#header1") + this._getTotalHeight("#header2");
        this.tabHeight = totalHeight - usedHeight;
        this.tabTopOffset = usedHeight;
    }
    _adjustContentHeight() {
        $("#content").height(this.tabHeight);
    }
    _adjustWidgetsHeight() {
        $(".jsWidgetsContainer").height(this.tabHeight).css("top", this.tabTopOffset);
        $(".jsMenuWidgetsSettings").height(this.tabHeight).css("top", this.tabTopOffset);
    }
    _getTotalHeight(selector) {
        let pad = parseInt($(selector).css("paddingTop")) + parseInt($(selector).css("paddingBottom"));
        let hei = $(selector).height();
        let bor = parseInt($(selector).css("borderTopWidth")) + parseInt($(selector).css("borderBottomWidth"));
        let totalHeight = pad + hei + bor;
        return totalHeight;
    }
}
exports.Design = Design;

},{}],15:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// Models
const tab_ts_1 = require("../model/tab.ts");
// Super classes
const names_ts_1 = require("./names.ts");
const trigger_ts_1 = require("./trigger.ts");
const db_ts_1 = require("./db.ts");
class Frontend {
    constructor() {
        this.tabContainerId = "header2";
        this.tabContentContainerId = "tabs";
        this.Names = new names_ts_1.Names();
        this.Trigger = new trigger_ts_1.Trigger();
    }
    InsertWidgetsTags() {
        db_ts_1.db.Widgets.forEach((value, index, array) => {
            $("body").append("<script type='text/javascript' src='" + value.url.slice(2) + "/main.js" + "'></script>");
            // $("body").append("<link rel='stylesheet' type='text/css' href='" + value.url.slice(2) + "/main.css" + "' />");
        });
    }
    LoadingLink(element, disabled = true) {
        if (disabled) {
            $(element).addClass("disabled");
        }
        else {
            $(element).removeClass("disabled");
        }
    }
    ReleaseLink(element) {
        this.LoadingLink(element, false);
    }
    formTab(tab) {
        if (tab) {
            tab.name = "tab #" + tab.id;
            return tab;
        }
        return new tab_ts_1.Tab();
    }
    newTab(tab) {
        var tabHtml = MyApp.templates.tab(tab);
        var tabContentHtml = MyApp.templates.tabContent(tab);
        // insert tab
        $(tabHtml).insertBefore("#" + this.tabContainerId + " > .clearfix");
        //document.getElementById(this.tabContainerId).innerHTML += tabHtml;
        // insert tab content
        document.getElementById(this.tabContentContainerId).innerHTML += tabContentHtml;
    }
    closeTab(tab_id) {
        $(".jsTab[data-tab-id='" + tab_id + "']").remove();
        $(".jsTabContent[data-tab-id='" + tab_id + "']").remove();
    }
    selectTab(tab) {
        let parentClassName = this.Names.classTabParent;
        $("." + parentClassName).removeClass("jsActive");
        $("." + parentClassName + "[data-tab-id=" + tab.id + "]").addClass("jsActive");
        let className = this.Names.eventsClassPrefix + "Tab";
        $("." + className).removeClass("jsActive");
        $("." + className + "[data-tab-id=" + tab.id + "]").addClass("jsActive");
        let tabClassName = this.Names.classTabContent;
        $("." + tabClassName).removeClass("jsShow").addClass("jsHide");
        $("." + tabClassName + "[data-tab-id=" + tab.id + "]").removeClass("jsHide").addClass("jsShow");
        this.ActiveTabId = tab.id;
    }
    showWidgetsMenu() {
        this.widgetsList(db_ts_1.db.Widgets);
        $("." + this.Names.classWidgetsContainer).animate({ width: 'toggle' });
    }
    widgetsList(list) {
        var html = MyApp.templates.widgetList(list);
        $("." + this.Names.classWidgetsList).html(html);
    }
    LoadWidgetContentAndInsert(widgetInstance, afterContentCallback) {
        this._loadWidgetContentAndInsert(widgetInstance, afterContentCallback);
    }
    _loadWidgetContentAndInsert(widgetInstance, afterContentCallback) {
        let currentTabId = this._getForcedCurrentTabId();
        let fn = this._insertWidget;
        $.ajax({
            url: widgetInstance.Widget.url.slice(2) + "/index.hbs",
            beforeSend: function () {
            },
            success: function (data) {
                MyApp.templates._widgetsTemplates[widgetInstance.Widget.alias] = Handlebars.compile(data);
                fn(widgetInstance, currentTabId, afterContentCallback);
            },
            error: function (e1, e2) {
                throw "Widget file not found!";
            }
        });
    }
    insertWidgetInstance(widgetInstance, afterContentCallback) {
        if (MyApp.templates._widgetsTemplates === undefined) {
            MyApp.templates._widgetsTemplates = [];
        }
        if (MyApp.templates._widgetsTemplates[widgetInstance.Widget.alias] === undefined) {
            this._loadWidgetContentAndInsert(widgetInstance, afterContentCallback);
        }
        else {
            let currentTabId = this._getForcedCurrentTabId();
            this._insertWidget(widgetInstance, currentTabId, afterContentCallback);
        }
    }
    _insertWidget(widgetInstance, currentTabId, afterContentCallback) {
        let content, html;
        content = MyApp.templates._widgetsTemplates[widgetInstance.Widget.alias]();
        let width = $(content).attr("data-width") + "px";
        let height = $(content).attr("data-height") + "px";
        let left, top;
        left = ($(".jsTabContent.jsShow").width() / 2).toString() + "px";
        top = ($(".jsTabContent.jsShow").height() / 2).toString() + "px";
        widgetInstance.position = { x: parseInt(left), y: parseInt(top) };
        widgetInstance.Tab = db_ts_1.db.getTab(currentTabId);
        html = MyApp.templates.widget({ WidgetInstance: widgetInstance, content: content, left: left, top: top, width: width, height: height });
        $("div.jsTabContent[data-tab-id=" + currentTabId + "]").append(html);
        widgetInstance.size.x = parseInt($(html).find(".ros-widget").attr("data-width"));
        widgetInstance.size.y = parseInt($(html).find(".ros-widget").attr("data-height"));
        let trigger = new trigger_ts_1.Trigger();
        trigger.widgetSettings(widgetInstance.id);
        if (afterContentCallback != undefined) {
            afterContentCallback();
        }
    }
    setWidgetInstancePosition(widgetInstance, position) {
        $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstance.id + "]").css({ top: position.y, left: position.x });
    }
    ;
    setWidgetInstanceSize(widgetInstance, size) {
        $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstance.id + "]").css({ height: size.y, width: size.x });
    }
    ;
    _getForcedCurrentTabId() {
        let currentTabId = this._getCurrentTabId();
        if (currentTabId === 0) {
            this.Trigger.newTab();
        }
        return this._getCurrentTabId();
    }
    _getCurrentTabId() {
        let tabIdStr = $("div.jsTab.jsActive").attr("data-tab-id");
        if (tabIdStr === undefined) {
            return 0;
        }
        let tabId = parseInt(tabIdStr);
        return tabId;
    }
    ShowWidgetSettings() {
        $(".jsMenuWidgetsSettings").animate({ right: 0 });
    }
    HideWidgetSettings() {
        $(".jsMenuWidgetsSettings").animate({ right: -300 });
        $(".jsWidgetContainer").attr("data-widget-conf", "0");
        $(".jsToggleMovable").removeClass("active");
    }
    // Update Selector Methods
    UpdateRosTopicSelectors(response) {
        $(".jsRosTopicSelector").html("");
        var html = '';
        $(".jsRosTopicSelector").each((i, element) => {
            let elementWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + $(element).attr("data-widget-instance-id") + "]");
            let elementMeta = $(elementWidgetInstance).find("meta[data-widget-topic-id='" + $(element).attr("data-widget-topic-id") + "']");
            let subscribedTopic = $(elementMeta).attr("data-subscribed-topic");
            html = MyApp.templates.rosTopicSelectorOptions({ name: '-- Select a topic to subscribe --', value: "" });
            let strTypes = $(element).attr("data-ros-topic-type");
            let types = (strTypes == "") ? [] : strTypes.split("|");
            response.topics.forEach((value, index) => {
                let selected = (value == subscribedTopic) ? true : false;
                if ((types.indexOf(response.types[index]) > -1) || types.length == 0) {
                    html += MyApp.templates.rosTopicSelectorOptions({ name: value, value: value, type: response.types[index], selected: selected });
                }
            });
            $(element).append(html);
        });
    }
    UpdateRosParamSelectors(response) {
        $(".jsRosParamSelector").html("");
        var html = '';
        $(".jsRosParamSelector").each((i, element) => {
            let elementWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + $(element).attr("data-widget-instance-id") + "]");
            let elementMeta = $(elementWidgetInstance).find("meta[data-ros-param-id='" + $(element).attr("data-ros-param-id") + "']");
            let selectedParam = $(elementMeta).attr("data-ros-param-slctd");
            html = MyApp.templates.rosParamSelectorOptions({ name: '-- Select a param to manage --', value: "" });
            response.forEach((value, index) => {
                let selected = (value == selectedParam) ? true : false;
                html += MyApp.templates.rosParamSelectorOptions({ name: value, value: value, selected: selected });
            });
            $(element).append(html);
        });
    }
    UpdateRosServiceSelectors(response) {
        $(".jsRosServiceSelector").html("");
        var html = '';
        $(".jsRosServiceSelector").each((i, element) => {
            let elementWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + $(element).attr("data-widget-instance-id") + "]");
            let elementMeta = $(elementWidgetInstance).find("meta[data-ros-service-id='" + $(element).attr("data-ros-service-id") + "']");
            let selectedService = $(elementMeta).attr("data-ros-service-slctd");
            html = MyApp.templates.rosServiceSelectorOptions({ name: '-- Select a service --', value: "" });
            response.forEach((value, index) => {
                let selected = (value == selectedService) ? true : false;
                html += MyApp.templates.rosServiceSelectorOptions({ name: value, value: value, selected: selected });
            });
            $(element).append(html);
        });
    }
    // Update Workspace Methods
    UpdateWorkspace(db) {
    }
}
exports.Frontend = Frontend;

},{"../model/tab.ts":9,"./db.ts":13,"./names.ts":18,"./trigger.ts":20}],16:[function(require,module,exports){
"use strict";
class InstanceLoader {
    getInstance(context, name, ...args) {
        var instance = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return instance;
    }
}
exports.instance_loader = new InstanceLoader();

},{}],17:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
class Lightbox {
    constructor() {
    }
    CreateLightbox() {
        var lightboxHtml = MyApp.templates.lightbox();
        $(lightboxHtml).insertAfter("#footer");
    }
    ShowLightbox(content) {
        $("#lightbox").html("");
        let wHeight = $(window).height();
        let wWidth = $(window).width();
        $("#lightboxBackground").css({ height: wHeight, width: wWidth }).fadeIn(500);
        if (content != undefined) {
            this.UpdateLightbox(content);
        }
    }
    CloseLightbox() {
        $("#lightboxBackground").hide();
    }
    UpdateLightbox(content) {
        $("#lightbox").html(content);
        let wHeight = $(window).height();
        let wWidth = $(window).width();
        let width = $("#lightbox").width();
        let height = $("#lightbox").height();
        let left = (wWidth - width) / 2;
        let top = (wHeight - height) / 2;
        $("#lightbox").css({ top: top, left: left });
    }
}
exports.lightbox = new Lightbox();

},{}],18:[function(require,module,exports){
"use strict";
class Names {
    constructor() {
        this.eventsClassPrefix = "jsEvent";
        this.classTabParent = "jsTab";
        this.classTabContent = "jsTabContent";
        this.classWidgetsContainer = "jsWidgetsContainer";
        this.classWidgetsSettings = "jsWidgetsSettings";
        this.classWidgets = "jsWidgets";
        this.classWidgetsList = "jsWidgetsList";
    }
}
exports.Names = Names;

},{}],19:[function(require,module,exports){
"use strict";
const workspace_ts_1 = require("../model/workspace.ts");
const rosweb_ts_1 = require("../model/rosweb.ts");
const db_ts_1 = require("./db.ts");
class Storage {
    constructor() {
        this.count = 0;
        if (localStorage["ROSWeb"] == undefined) {
            let rosweb = new rosweb_ts_1.ROSWeb();
            localStorage.setItem("ROSWeb", JSON.stringify(rosweb));
            console.log("creating rosweb localstorage");
        }
    }
    Init() {
    }
    // Get
    GetWorkspaces() {
        let rosweb;
        try {
            rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
        }
        catch (e) {
            alert(e);
        }
        return rosweb.Workspaces;
    }
    GetWorkspace(workspace_id) {
        let toReturn;
        this.GetWorkspaces().forEach((workspace, index, array) => {
            if (workspace.id == workspace_id) {
                toReturn = workspace;
            }
        });
        return toReturn;
    }
    // New
    NewWorkspace(name) {
        let id;
        let workspaces = this.GetWorkspaces();
        if (workspaces.length == 0) {
            id = 1;
        }
        else {
            function sortByIdDesc(obj1, obj2) {
                if (obj1.id > obj2.id)
                    return -1;
                if (obj1.id < obj2.id)
                    return 1;
            }
            let lastWorkspace = workspaces.sort(sortByIdDesc)[0];
            id = lastWorkspace.id + 1;
        }
        let workspace = new workspace_ts_1.Workspace();
        workspace.id = id;
        workspace.name = name;
        return workspace;
    }
    // Save
    SaveWorkspace(workspace) {
        let rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
        workspace.db = {
            Tabs: db_ts_1.db.Tabs,
            TabCounter: db_ts_1.db.TabCounter,
            WidgetInstances: db_ts_1.db.WidgetInstances,
            WidgetInstanceCounter: db_ts_1.db.WidgetInstanceCounter
        };
        rosweb.Workspaces.push(workspace);
        localStorage.setItem("ROSWeb", JSON.stringify(rosweb));
    }
    // Load
    LoadWorkspace(id) {
        try {
            let workspaces = JSON.parse(localStorage["ROSWeb"]["workspaces"]);
        }
        catch (e) {
            alert(e);
        }
    }
    // Remove
    RemoveWorkspace(id) {
        let rosweb;
        let updatedRosweb = new rosweb_ts_1.ROSWeb();
        try {
            rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
            updatedRosweb.Workspaces = new Array();
            function filterById(workspace) {
                return workspace.id != id;
            }
            updatedRosweb.Workspaces = rosweb.Workspaces.filter(filterById);
            localStorage.setItem("ROSWeb", JSON.stringify(updatedRosweb));
            return updatedRosweb.Workspaces;
        }
        catch (e) {
            throw new Error(e);
        }
    }
}
exports.storage = new Storage();

},{"../model/rosweb.ts":8,"../model/workspace.ts":12,"./db.ts":13}],20:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
class Trigger {
    constructor() {
    }
    newTab() {
        $(".jsEventNewTab")[0].click();
    }
    widgetSettings(widgetInstanceId) {
        $(".jsWidgetSettings[data-widget-instance-id=" + widgetInstanceId + "]")[0].click();
    }
}
exports.Trigger = Trigger;

},{}]},{},[7])


//# sourceMappingURL=bundle.js.map
