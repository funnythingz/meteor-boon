// Definitions for the iron-router smart package
//
// https://atmosphere.meteor.com/package/iron-router
// https://github.com/EventedMind/iron-router

declare module Router {

    interface TemplateConfig {
        to?: string;
        waitOn?: boolean;
        data?: boolean;
    }

    interface TemplateConfigDico {[id:string]:TemplateConfig}

    interface GlobalConfig {
        layoutTemplate?: string;
        notFoundTemplate?: string;
        loadingTemplate?: string;
    }

    interface MapConfig {
        path?:string;
        // by default template is the route name, this field is the override
        template?:string;
        layoutTemplate?: string;
        yieldTemplates?: TemplateConfigDico;
        // can be a Function or an object literal {}
        data?: any;
        // waitOn can be a subscription handle, an array of subscription handles or a function that returns a subscription handle
        // or array of subscription handles. A subscription handle is what gets returned when you call Meteor.subscribe
        waitOn?: any;
        loadingTemplate?:string;
        notFoundTemplate?: string;
        controller?: string;
        action?: Function;

        // The before and after hooks can be Functions or an array of Functions
        before?: any;
        after?: any;
        load?: Function;
        unload?: Function;
        reactive?: boolean;
    }

    interface HookOptions {
        except?: string[];
    }

    interface HookOptionsDico {[id:string]:HookOptions}

    // Deprecated:  for old "Router" smart package
    function page():void;
    function add(route:Object):void;
    function to(path:string, ...args:any[]):void;
    function filters(filtersMap:Object);
    function filter(filterName:string, options?:Object);

    // These are for Iron-Router
    function configure(config:GlobalConfig);
    function map(func:Function):void;
    function route(name:string, routeParams?:MapConfig, handler?:any);
    function path(route:string, params?:Object):string;
    function url(route:string):string;
    function go(route:string, params?:Object):void;
    function before(func: Function, options?: HookOptionsDico): void;
    function after(func: Function, options?: HookOptionsDico): void;
    function load(func: Function, options?: HookOptionsDico): void;
    function unload(func: Function, options?: HookOptionsDico): void;
    function render(template?: string, options?: TemplateConfigDico): void;
    function wait(): void;
    function stop(): void;
    function redirect(): void;

    function onRun(func?: Function, params?: any): void;
    function onBeforeAction(hook?: string, func?: Function, params?: any): void;
    function onAfterAction(func?: Function, params?: any): void;
    function onStop(func?: Function, params?: any): void;

    var routes: {};
    var params: any;
}

interface RouteController {
    render(route:string);
    extend(routeParams: Router.MapConfig);
}

declare var RouteController:RouteController;
