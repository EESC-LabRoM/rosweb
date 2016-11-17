(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// import {db} from "../super/db.ts";
const lightbox_1 = require("../super/lightbox");
class EventsParent {
    constructor() {
        this.nothing = (e) => {
            e.preventDefault();
        };
        this.HideLightbox = (e) => {
            lightbox_1.lightbox.CloseLightbox();
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

},{"../super/lightbox":18}],2:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// Parent Class
const events_1 = require("./events");
const frontend_1 = require("../super/frontend");
class RosEvents extends events_1.EventsParent {
    constructor(ros) {
        super();
        this.connected = false;
        this.Connect = (e) => {
            if ($(".jsRosConnect").hasClass("loading")) {
                return;
            }
            $(".jsRosConnect").addClass("loading");
            if (!this.connected) {
                let url = $("#jsRosUrl").val();
                this.Ros.connect(url);
            }
            else {
                this.Ros.close();
            }
            if (e != undefined)
                e.preventDefault();
        };
        this.Configuration = (e) => {
            frontend_1.frontend.ShowConfiguration();
            e.preventDefault();
        };
        this.OnRosConnection = () => {
            this.connected = true;
            $(".jsRosConnect").addClass("active");
            $(".jsRosConnect").removeClass("loading");
            $(".jsRosConnect, #jsRosUrl, .jsConfiguration").removeClass("alert");
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
            $(".jsRosConnect, #jsRosUrl, .jsConfiguration").addClass("alert");
            console.log(error);
        };
        this.Ros = ros;
        this.Ros.on("connection", this.OnRosConnection);
        this.Ros.on("close", this.OnRosClose);
        this.Ros.on("error", this.OnRosError);
        this.DelegateEvent(".jsRosConnect", "click", this.Connect);
        this.DelegateEvent(".jsConfiguration", "click", this.Configuration);
    }
}
exports.RosEvents = RosEvents;

},{"../super/frontend":16,"./events":1}],3:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// Parent Class
const events_1 = require("./events");
const tab_1 = require("../model/tab");
const workspace_1 = require("../model/workspace");
// Super classes
// import {db} from "../super/db"
const design_1 = require("../super/design");
const frontend_1 = require("../super/frontend");
class TabEvents extends events_1.EventsParent {
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
            let tab = workspace_1.currentWorkspace.get(tabId, "Tab");
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
        this.Frontend = new frontend_1.Frontend();
        this.Design = new design_1.Design();
        // Resize Events
        this.DelegateEvent(window, "resize", this._windowResized);
        // Left Click Events
        this.DelegateEvent(".jsEventNothing", "click", this.nothing);
        this.DelegateEvent(".jsEventNewTab", "click", this.newTab);
        this.DelegateEvent(".jsEventTab", "click", this.selectTab);
        this.DelegateEvent(".jsEventCloseTab", "click", this.closeTab);
        this.DelegateEvent(".jsRosweb", "click", (e) => {
            console.log(workspace_1.currentWorkspace);
            e.preventDefault();
        });
    }
    _newTab() {
        var tab = new tab_1.Tab();
        this._selectTab(tab);
    }
    _selectTab(selectedTab) {
        let list = workspace_1.currentWorkspace.getList("Tab");
        list.forEach((tab, index) => {
            if (selectedTab.id != tab.id)
                tab.active = false;
        });
        selectedTab.setActive();
        let widgetInstances = workspace_1.currentWorkspace.getList("WidgetInstance");
        widgetInstances.forEach((widgetInstance, index) => {
            widgetInstance.WidgetCallbackClass["clbkTab"](selectedTab.id == widgetInstance.tab_id);
        });
    }
    _closeTab(tabId) {
        workspace_1.currentWorkspace.remove(tabId, "Tab");
        this.Frontend.closeTab(tabId);
    }
}
exports.TabEvents = TabEvents;

},{"../model/tab":10,"../model/workspace":14,"../super/design":15,"../super/frontend":16,"./events":1}],4:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// Super
const frontend_1 = require("../super/frontend");
const widget_instance_1 = require("../model/widget_instance");
const workspace_1 = require("../model/workspace");
// Parent Class
const events_1 = require("./events");
class WidgetEvents extends events_1.EventsParent {
    constructor(ros) {
        super();
        this.Frontend = new frontend_1.Frontend();
        this.widgetMenu = (e) => {
            this._widgetMenu();
            e.preventDefault();
        };
        this.widgetItem = (e) => {
            let widgetId = parseInt($(e.toElement).attr("data-widget-id"));
            let widget = workspace_1.currentWorkspace.get(widgetId, "Widget");
            let tab = workspace_1.currentWorkspace.getCurrentTab();
            this._widgetItem(widget, tab);
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
    _widgetItem(widget, tab) {
        new widget_instance_1.WidgetInstance(widget, tab);
    }
}
exports.WidgetEvents = WidgetEvents;

},{"../model/widget_instance":13,"../model/workspace":14,"../super/frontend":16,"./events":1}],5:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// Super
const frontend_1 = require("../super/frontend");
const workspace_1 = require("../model/workspace");
// import {db} from "../super/db.ts";
// Parent Class
const events_1 = require("./events");
class WidgetInstanceEvents extends events_1.EventsParent {
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
            // widget instance id
            let widgetInstanceId = parseInt($("input#widgetSettings").val());
            // manage ros data
            this._WidgetSettingsConfirmSubscriptions(widgetInstanceId);
            this._WidgetSettingsConfirmRosParams(widgetInstanceId);
            this._WidgetSettingsConfirmRosServices(widgetInstanceId);
            // manage params
            this._WidgetSettingsConfirmParams(widgetInstanceId);
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
            workspace_1.currentWorkspace.remove(widgetInstanceId, "WidgetInstance");
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
            this._WidgetSettings(this.widgetInstanceId);
            $(e.toElement).closest(".jsWidgetContainer").addClass("jsMouseActive");
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
            $(".jsWidgetContainer").removeClass("jsMouseActive");
        };
        this.Ros = ros;
        this.Frontend = new frontend_1.Frontend();
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
        $(".jsWidgetContainer").removeClass("jsSettingsActive");
        $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]").addClass("jsSettingsActive");
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
        }, (topicsError) => {
            alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
            console.log(topicsError);
        });
    }
    ;
    _WidgetSettingsRefreshParams() {
        this.Ros.getParams((paramsResponse) => {
            this.Frontend.UpdateRosParamSelectors(paramsResponse);
            this._WidgetSettingsRefreshsServices();
        }, (paramsError) => {
            alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
            console.log(paramsError);
        });
    }
    ;
    _WidgetSettingsRefreshsServices() {
        this.Ros.getServices((servicesResponse) => {
            this.Frontend.UpdateRosServiceSelectors(servicesResponse);
            this.Frontend.LoadingLink($(".jsWidgetSettingsRefresh")[0], false);
            $(".jsRosTopicSelector").removeAttr("disabled");
        }, (servicesError) => {
            alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
            console.log(servicesError);
        });
    }
    ;
    _WidgetSettingsConfirmSubscriptions(widgetInstanceId) {
        $(".jsRosTopicSelector").each((index, elem) => {
            let topic_name = $(elem).val();
            let widgetInstance = workspace_1.currentWorkspace.get(widgetInstanceId, "WidgetInstance");
            let topicChangeCallback = $(elem).attr("data-ros-topic-chng");
            widgetInstance.WidgetCallbackClass[topicChangeCallback](topic_name);
            let rosTopicId = $(elem).attr("data-ros-topic-id");
            let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
            let htmlMeta = $(htmlWidgetInstance).find("meta[data-ros-topic-id=" + rosTopicId + "]");
            $(htmlMeta).attr("data-ros-topic-slctd", topic_name);
        });
    }
    ;
    _WidgetSettingsConfirmRosParams(widgetInstanceId) {
        $(".jsRosParamSelector").each((index, elem) => {
            let widgetInstance = workspace_1.currentWorkspace.get(widgetInstanceId, "WidgetInstance");
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
    _WidgetSettingsConfirmRosServices(widgetInstanceId) {
        $(".jsRosServiceSelector").each((index, elem) => {
            let widgetInstance = workspace_1.currentWorkspace.get(widgetInstanceId, "WidgetInstance");
            let serviceChangeCallback = $(elem).attr("data-ros-service-chng");
            let serviceSelected = $(elem).val();
            widgetInstance.WidgetCallbackClass[serviceChangeCallback](serviceSelected);
            let rosServiceId = $(elem).attr("data-ros-service-id");
            let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
            let htmlMeta = $(htmlWidgetInstance).find("meta[data-ros-service-id=" + rosServiceId + "]");
            $(htmlMeta).attr("data-ros-service-slctd", serviceSelected);
        });
    }
    _WidgetSettingsConfirmParams(widgetInstanceId) {
        $(".jsWidgetParam").each((index, elem) => {
            let widgetInstance = workspace_1.currentWorkspace.get(widgetInstanceId, "WidgetInstance");
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
        let widgetInstance = workspace_1.currentWorkspace.get(this.widgetInstanceId, "WidgetInstance");
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
        let widgetInstance = workspace_1.currentWorkspace.get(this.widgetInstanceId, "WidgetInstance");
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

},{"../model/workspace":14,"../super/frontend":16,"./events":1}],6:[function(require,module,exports){
"use strict";
const storage_1 = require("../super/storage");
// import {db} from "../super/db.ts";
const lightbox_1 = require("../super/lightbox");
const events_1 = require("./events");
const serialized_workspace_1 = require("../model/serialized_workspace");
const workspace_1 = require("../model/workspace");
class WorkspaceEvents extends events_1.EventsParent {
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
            let workspace = storage_1.storage.GetWorkspace(workspace_id);
            this._RemoveWorkspace(workspace);
            e.preventDefault();
        };
        this.DelegateEvent(".jsOpenWorkspace", "click", this.OpenWorkspace);
        this.DelegateEvent(".jsSaveWorkspace", "click", this.SaveWorkspace);
        this.DelegateEvent(".jsLoadWorkspace", "click", this.LoadWorkspace);
        this.DelegateEvent(".jsRemoveWorkspace", "click", this.RemoveWorkspace);
    }
    _OpenWorkspace() {
        let workspaces = storage_1.storage.GetWorkspaces();
        let html = MyApp.templates.workspaceList(workspaces);
        lightbox_1.lightbox.ShowLightbox(html);
    }
    _SaveWorkspace() {
        let workspace = new serialized_workspace_1.SerializedWorkspace();
        workspace = storage_1.storage.NewWorkspace($("#jsWorkspaceName").val());
        workspace.data = workspace_1.currentWorkspace.extractData();
        storage_1.storage.SaveWorkspace(workspace);
    }
    _LoadWorkspace(workspace_id) {
        let workspace = storage_1.storage.GetWorkspace(workspace_id);
        workspace_1.currentWorkspace.loadWorkspace(workspace);
        lightbox_1.lightbox.CloseLightbox();
    }
    _RemoveWorkspace(workspace) {
        if (window.confirm("Are you sure you want to remove workspace #" + workspace.id + " (" + workspace.id + ") ?")) {
            let html = MyApp.templates.workspaceList(storage_1.storage.RemoveWorkspace(workspace.id));
            lightbox_1.lightbox.UpdateLightbox(html);
        }
        else {
        }
    }
}
exports.WorkspaceEvents = WorkspaceEvents;

},{"../model/serialized_workspace":9,"../model/workspace":14,"../super/lightbox":18,"../super/storage":20,"./events":1}],7:[function(require,module,exports){
/// <reference path="./typings/tsd.d.ts" />
"use strict";
// Events
const tab_1 = require("./events/tab");
const widget_1 = require("./events/widget");
const widget_instance_1 = require("./events/widget_instance");
const ros_1 = require("./events/ros");
const workspace_1 = require("./events/workspace");
// Super
const lightbox_1 = require("./super/lightbox");
const workspace_2 = require("./model/workspace");
function init() {
    $(document).ready(function () {
        var ros = new ROSLIB.Ros("");
        window["ros"] = ros;
        events(ros);
        lightbox_1.lightbox.CreateLightbox();
        workspace_2.currentWorkspace.initWorkspace();
    });
}
function events(ros) {
    let tabEvents = new tab_1.TabEvents();
    let widgetEvents = new widget_1.WidgetEvents(ros);
    let widgetInstanceEvents = new widget_instance_1.WidgetInstanceEvents(ros);
    let rosEvents = new ros_1.RosEvents(ros);
    let workspace = new workspace_1.WorkspaceEvents();
    rosEvents.Connect();
}
init();

},{"./events/ros":2,"./events/tab":3,"./events/widget":4,"./events/widget_instance":5,"./events/workspace":6,"./model/workspace":14,"./super/lightbox":18}],8:[function(require,module,exports){
"use strict";
class ROSWeb {
    constructor() {
        this.Workspaces = new Array();
    }
}
exports.ROSWeb = ROSWeb;

},{}],9:[function(require,module,exports){
"use strict";
class SerializedWorkspace {
}
exports.SerializedWorkspace = SerializedWorkspace;

},{}],10:[function(require,module,exports){
"use strict";
const workspace_1 = require("./workspace");
const frontend_1 = require("../super/frontend");
class Tab {
    constructor(name) {
        workspace_1.currentWorkspace.create(this);
        this.name = "Tab #" + this.id;
        frontend_1.frontend.newTab(this);
        this.setActive();
    }
    setActive() {
        this.active = true;
        frontend_1.frontend.selectTab(this);
    }
}
exports.Tab = Tab;

},{"../super/frontend":16,"./workspace":14}],11:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
const frontend_1 = require("../super/frontend");
const workspace_1 = require("./workspace");
class Widget {
    constructor(widget_group_id, name, alias, url) {
        this.widget_group_id = widget_group_id;
        this.name = name;
        this.url = url;
        this.alias = alias;
        workspace_1.currentWorkspace.create(this);
        frontend_1.frontend.newWidget(this);
    }
}
exports.Widget = Widget;

},{"../super/frontend":16,"./workspace":14}],12:[function(require,module,exports){
"use strict";
const frontend_1 = require("../super/frontend");
const workspace_1 = require("./workspace");
class WidgetGroup {
    constructor(name) {
        this.name = name;
        workspace_1.currentWorkspace.create(this);
        frontend_1.frontend.newWidgetGroup(this);
    }
}
exports.WidgetGroup = WidgetGroup;

},{"../super/frontend":16,"./workspace":14}],13:[function(require,module,exports){
"use strict";
const frontend_1 = require("../super/frontend");
const workspace_1 = require("./workspace");
const instance_loader_1 = require("../super/instance_loader");
class WidgetInstance {
    constructor(widget, tab, position = { x: 0, y: 0 }, size = { x: 0, y: 0 }) {
        this.widget_id = widget.id;
        this.tab_id = tab.id;
        this.position = position;
        this.size = size;
        workspace_1.currentWorkspace.create(this);
        this.WidgetCallbackClass = instance_loader_1.instance_loader.getInstance(window, "Widget" + widget.alias, this.id);
        frontend_1.frontend.insertWidgetInstance(this, this.WidgetCallbackClass["clbkCreated"]);
    }
}
exports.WidgetInstance = WidgetInstance;

},{"../super/frontend":16,"../super/instance_loader":17,"./workspace":14}],14:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// model
const tab_1 = require("./tab");
const widget_group_1 = require("./widget_group");
const widget_1 = require("./widget");
const widget_instance_1 = require("./widget_instance");
// super
const frontend_1 = require("../super/frontend");
var className = "";
function genericFilter(list, index, array) {
    return (list.object == className);
}
class Workspace {
    constructor() {
        this._clearLists();
        this._clearCounters();
    }
    initWorkspace() {
        this._initWorkspace();
    }
    _initWorkspace() {
        let wg = new widget_group_1.WidgetGroup("ROS basics");
        new widget_1.Widget(wg.id, "Topic Subscriber", "TopicSubscriber", "./widgets/topic_subscriber");
        new widget_1.Widget(wg.id, "Param Viewer", "ParamViewer", "./widgets/param_viewer");
        new widget_1.Widget(wg.id, "Service Viewer", "ServiceViewer", "./widgets/service_viewer");
        wg = new widget_group_1.WidgetGroup("Sensors");
        new widget_1.Widget(wg.id, "Google Maps GPS Viewer", "GoogleMapsGpsViewer", "./widgets/gmaps_gps");
        new widget_1.Widget(wg.id, "Camera Viewer", "CameraViewer", "./widgets/camera_viewer");
        new widget_1.Widget(wg.id, "Laser Scan Viewer", "LaserScanViewer", "./widgets/laser_scan_viewer");
        wg = new widget_group_1.WidgetGroup("3D Viewer");
        new widget_1.Widget(wg.id, "ROS 3D Viewer", "ROS3DViewer", "./widgets/ros_3d_viewer");
    }
    _clearWorkspace() {
        frontend_1.frontend.ClearWorkspace();
        this._clearLists();
        this._clearCounters();
        this._initWorkspace();
    }
    _clearLists() {
        this.Lists = new Array({ object: "Tab", list: new Array() }, { object: "WidgetGroup", list: new Array() }, { object: "Widget", list: new Array() }, { object: "WidgetInstance", list: new Array() });
    }
    _clearCounters() {
        this.Counters = new Array({ object: "Tab", counter: 0 }, { object: "WidgetGroup", counter: 0 }, { object: "Widget", counter: 0 }, { object: "WidgetInstance", counter: 0 });
    }
    loadWorkspace(workspace) {
        let data = JSON.parse(workspace.data);
        this._clearWorkspace();
        data.Lists.forEach((glist, i) => {
            if (glist.object == "Tab") {
                glist.list.forEach((tab, j) => {
                    new tab_1.Tab(tab.name);
                });
            }
        });
        data.Lists.forEach((glist, i) => {
            if (glist.object == "WidgetInstance") {
                glist.list.forEach((widgetInstance, j) => {
                    let widget = this.get(widgetInstance.widget_id, "Widget");
                    let tab = this.get(widgetInstance.tab_id, "Tab");
                    let createdWidgetInstance = new widget_instance_1.WidgetInstance(widget, tab, widgetInstance.position, widgetInstance.size);
                });
            }
        });
        this.Counters = data.Counters;
    }
    extractData() {
        let data = { Lists: this.Lists, Counters: this.Counters };
        data.Lists.forEach((list, index) => {
            switch (list.object) {
                case "WidgetInstance":
                    list.list.forEach((widgetInstance, index) => {
                        widgetInstance["WidgetCallbackClass"] = null;
                    });
                    break;
            }
        });
        let dataString = JSON.stringify(data);
        return dataString;
    }
    getCounter() {
        let counter = this.Counters.filter(genericFilter);
        if (counter.length != 1) {
            throw new Error("Workspace list searching error");
        }
        return counter[0];
    }
    getList(aClassName) {
        if (aClassName != undefined)
            className = aClassName;
        let list = this.Lists.filter(genericFilter);
        if (list.length != 1) {
            throw new Error("Workspace list searching error");
        }
        return list[0].list;
    }
    create(object) {
        let aClassName = object.constructor["name"];
        className = aClassName;
        let counter = this.getCounter();
        let list = this.getList();
        object.id = ++counter.counter;
        list.push(object);
    }
    get(id, aClassName) {
        className = aClassName;
        let list = this.Lists.filter(genericFilter)[0].list;
        function getFilter(element, index, array) {
            return element.id == id;
        }
        ;
        let filteredList = list.filter(getFilter);
        if (filteredList.length != 1) {
            console.log(list);
            throw new Error("No unique " + aClassName + " found with id equals to " + id + " on the list above");
        }
        return filteredList[0];
    }
    getCurrentTab() {
        className = "Tab";
        let list = this.Lists.filter(genericFilter)[0].list;
        let tab;
        if (list.length == 0) {
            tab = new tab_1.Tab();
        }
        function activeTabFilter(tab, index, array) {
            return tab.active == true;
        }
        let filteredList = list.filter(activeTabFilter);
        tab = filteredList[0];
        return tab;
    }
    remove(id, aClassName) {
        className = aClassName;
        let list = this.Lists.filter(genericFilter)[0].list;
        let toRemove = null;
        list.forEach((obj, index) => {
            if (obj.id == id) {
                toRemove = index;
            }
        });
        if (toRemove == null) {
            console.log(list);
            throw new Error("No unique " + aClassName + " found with id equals to " + id + " on the list above");
        }
        else {
            list.splice(toRemove, 1);
        }
    }
}
exports.Workspace = Workspace;
exports.currentWorkspace = new Workspace();

},{"../super/frontend":16,"./tab":10,"./widget":11,"./widget_group":12,"./widget_instance":13}],15:[function(require,module,exports){
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
        // $(".jsWidgetsContainer").height(this.tabHeight).css("top", this.tabTopOffset);
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

},{}],16:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
// Models
const tab_1 = require("../model/tab");
const workspace_1 = require("../model/workspace");
// Super classes
const names_1 = require("./names");
const trigger_1 = require("./trigger");
class Frontend {
    constructor() {
        this.tabContainerId = "header2";
        this.tabContentContainerId = "tabs";
        this.Names = new names_1.Names();
        this.Trigger = new trigger_1.Trigger();
    }
    InsertWidgetsTags() {
        workspace_1.currentWorkspace.getList().forEach((value, index, array) => {
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
        return new tab_1.Tab();
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
    LoadWidgetContentAndInsert(widgetInstance, afterContentCallback) {
        this._loadWidgetContentAndInsert(widgetInstance, afterContentCallback);
    }
    _loadWidgetContentAndInsert(widgetInstance, afterContentCallback) {
        let tabId = widgetInstance.tab_id != undefined ? widgetInstance.tab_id : this._getForcedCurrentTabId();
        let fn = this._insertWidget;
        let widget = workspace_1.currentWorkspace.get(widgetInstance.widget_id, "Widget");
        $.ajax({
            url: widget.url.slice(2) + "/index.hbs",
            beforeSend: function () {
            },
            success: function (data) {
                MyApp.templates._widgetsTemplates[widget.alias] = Handlebars.compile(data);
                fn(widgetInstance, tabId, afterContentCallback);
            },
            error: function (e1, e2) {
                throw "Widget file not found!";
            }
        });
    }
    insertWidgetInstance(widgetInstance, afterContentCallback) {
        let widget = workspace_1.currentWorkspace.get(widgetInstance.widget_id, "Widget");
        if (MyApp.templates._widgetsTemplates === undefined) {
            MyApp.templates._widgetsTemplates = [];
        }
        if (MyApp.templates._widgetsTemplates[widget.alias] === undefined) {
            this._loadWidgetContentAndInsert(widgetInstance, afterContentCallback);
        }
        else {
            let tabId = widgetInstance.tab_id != undefined ? widgetInstance.tab_id : this._getForcedCurrentTabId();
            this._insertWidget(widgetInstance, tabId, afterContentCallback);
        }
    }
    _insertWidget(widgetInstance, currentTabId, afterContentCallback) {
        let content, html;
        let widget = workspace_1.currentWorkspace.get(widgetInstance.widget_id, "Widget");
        content = MyApp.templates._widgetsTemplates[widget.alias](widgetInstance);
        let width = parseInt($(content).attr("data-width"));
        let height = parseInt($(content).attr("data-height"));
        let left = $(".jsTabContent.jsShow").width() / 2;
        let top = $(".jsTabContent.jsShow").height() / 2;
        if (widgetInstance.position.x == 0 && widgetInstance.position.y == 0) {
            widgetInstance.position = { x: left, y: top };
        }
        if (widgetInstance.size.x == 0 && widgetInstance.size.y == 0) {
            widgetInstance.size = { x: width, y: height };
        }
        html = MyApp.templates.widget({ WidgetInstance: widgetInstance, content: content, left: widgetInstance.position.x + "px", top: widgetInstance.position.y + "px", width: widgetInstance.size.x + "px", height: widgetInstance.size.y + "px" });
        $("div.jsTabContent[data-tab-id=" + currentTabId + "]").append(html);
        let trigger = new trigger_1.Trigger();
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
    // Show menu methods
    showWidgetsMenu() {
        $(".balloon").not("." + this.Names.classWidgetsContainer).hide();
        $("." + this.Names.classWidgetsContainer).animate({ height: 'toggle' });
    }
    ShowWidgetSettings() {
        $(".jsMenuWidgetsSettings").animate({ right: 0 });
    }
    HideWidgetSettings() {
        $(".jsMenuWidgetsSettings").animate({ right: -300 });
        $(".jsWidgetContainer").attr("data-widget-conf", "0");
        $(".jsToggleMovable").removeClass("active");
    }
    ShowConfiguration() {
        $(".balloon").not("." + this.Names.classConfiguration).hide();
        $("." + this.Names.classConfiguration).animate({ height: 'toggle' });
    }
    // Update Selector Methods
    UpdateRosTopicSelectors(response) {
        $(".jsRosTopicSelector").html("");
        var html = '';
        $(".jsRosTopicSelector").each((i, element) => {
            let elementWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + $(element).attr("data-widget-instance-id") + "]");
            let elementMeta = $(elementWidgetInstance).find("meta[data-ros-topic-id='" + $(element).attr("data-ros-topic-id") + "']");
            let subscribedTopic = $(elementMeta).attr("data-ros-topic-slctd");
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
    ClearWorkspace() {
        $(".jsWidgetsList").html("");
        $(".jsTab").remove();
        $("#tabs").html("");
    }
    // Model frontend
    newTab(tab) {
        var tabHtml = MyApp.templates.tab(tab);
        var tabContentHtml = MyApp.templates.tabContent(tab);
        // insert tab
        $(tabHtml).insertBefore("#" + this.tabContainerId + " > .clearfix");
        //document.getElementById(this.tabContainerId).innerHTML += tabHtml;
        // insert tab content
        document.getElementById(this.tabContentContainerId).innerHTML += tabContentHtml;
    }
    newWidgetGroup(widgetGroup) {
        let html = MyApp.templates.widgetGroup(widgetGroup);
        $(".jsWidgetGroups").append(html);
    }
    newWidget(widget) {
        let html = MyApp.templates.widgetItem(widget);
        $("#jsWidgetGroup" + widget.widget_group_id + " .jsWidgets").append(html);
        $("body").append("<script type='text/javascript' src='" + widget.url.slice(2) + "/main.js'></script>");
    }
    newWidgetInstance(widgetInstance) {
        this.insertWidgetInstance(widgetInstance, () => { });
    }
}
exports.Frontend = Frontend;
exports.frontend = new Frontend();

},{"../model/tab":10,"../model/workspace":14,"./names":19,"./trigger":21}],17:[function(require,module,exports){
"use strict";
class InstanceLoader {
    getInstance(context, name, ...args) {
        var instance = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return instance;
    }
}
exports.instance_loader = new InstanceLoader();

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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
        this.classConfiguration = "jsConfigurationContainer";
    }
}
exports.Names = Names;

},{}],20:[function(require,module,exports){
"use strict";
const rosweb_1 = require("../model/rosweb");
const serialized_workspace_1 = require("../model/serialized_workspace");
class Storage {
    constructor() {
        this.count = 0;
        if (localStorage["ROSWeb"] == undefined) {
            let rosweb = new rosweb_1.ROSWeb();
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
        function sortByIdDesc(obj1, obj2) {
            if (obj1.id > obj2.id)
                return -1;
            if (obj1.id < obj2.id)
                return 1;
        }
        if (workspaces.length == 0) {
            id = 1;
        }
        else {
            let lastWorkspace = workspaces.sort(sortByIdDesc)[0];
            id = lastWorkspace.id + 1;
        }
        let workspace = new serialized_workspace_1.SerializedWorkspace();
        workspace.id = id;
        workspace.name = name;
        return workspace;
    }
    // Save
    SaveWorkspace(workspace) {
        let rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
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
        let updatedRosweb = new rosweb_1.ROSWeb();
        function filterById(workspace) {
            return workspace.id != id;
        }
        try {
            rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
            updatedRosweb.Workspaces = new Array();
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

},{"../model/rosweb":8,"../model/serialized_workspace":9}],21:[function(require,module,exports){
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
