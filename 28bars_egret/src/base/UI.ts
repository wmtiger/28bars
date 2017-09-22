module ui {

    export var fairyLayer: fairygui.GComponent;
    export var loadingLayer: fairygui.GComponent;


    var _screenClassDict: any = {};
    export function register(id: number, screenClass: any): void {
        _screenClassDict[id] = screenClass;
    }


    var _currentScreen: SspScreen;
    var _willOpenScreen: SspScreen;
    var _loadingScreen: ILoadingScreen;
    export function open(id: number, ...args): void {
        var ScreenClass = _screenClassDict[id];
        var sspUi: ISspUi = new ScreenClass();
        sspUi.openData = args;

        if (sspUi instanceof SspScreen) {
            if (_currentScreen == sspUi) return;
            _willOpenScreen = sspUi;
            if (_loadingScreen == null) {
                _loadingScreen = new fg.FightGridLoadingScreen();
                // _loadingScreen = new LoadingScreen();
            }
            _loadingScreen.load(_willOpenScreen.resGroup, onScreenLoadCompelte, this);
        }

        else if (sspUi instanceof SspWindow) {
            // sspUi.show();
            fairygui.GRoot.inst.showPopup(sspUi);
            sspUi.center();
        }

    }

    function onScreenLoadCompelte(): void {
        if (_currentScreen != null) {
            _currentScreen.hideUi();
        }
        _currentScreen = _willOpenScreen;
        _willOpenScreen.showUi();
        _willOpenScreen = null;
        _loadingScreen.hideUi();

    }


    export interface ISspUi {
        openData: any;
        getChild(path: string): fairygui.GObject;
        getPath(gObject: fairygui.GObject): string;
        showUi(): void;
        hideUi(): void;
        dispose(): void;
    }

    export interface ILoadingScreen extends ISspUi {
        load(groups: string[], complete: Function, thisObj: any);
    }

    export class SspScreen extends puremvc.Mediator implements ISspUi {

        /** 打开程序时，传递的参数 */
        openData: any;
        /** 配置用到的资源组 */
        resGroup: string[];
        /** 界面加载成功后，是否预加载其他的资源 */
        preload: number[];
        /** 资源显示对象 */
        view: fairygui.GComponent;

        fairyPkgName: string;
        fairyResName: string;
        fairyUserClass: any;

        parentLayer: fairygui.GComponent;

        uipackage: fairygui.UIPackage;

        getSound(name: string): egret.Sound {
            return this.uipackage.getItemAssetByName(name);
        }
        protected _initCommonPack() {
            if (cfg.commonPack == null) cfg.commonPack = fairygui.UIPackage.addPackage("common");
        }

        showUi(): void {
            this._initCommonPack();
            this.uipackage = fairygui.UIPackage.addPackage(this.fairyPkgName);
            this.view = fairygui.UIPackage.createObject(this.fairyPkgName, this.fairyResName, this.fairyUserClass).asCom;
            this._fastChildGetter = new comp.FastChildGetter(this.view, this.onClick, this);
            this.setViewComponent(this.view);
            puremvc.Facade.getInstance().registerMediator(this);
            this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
            if (this.parentLayer == null) this.parentLayer = fairyLayer;
            this.parentLayer.addChild(this.view);
            this.onInit();
        }
        onInit(): void {

        }
        onClick(target: fairygui.GObject): void {

        }
        hideUi(): void {
            this.onHide();
            if (this.view != null) this.view.removeFromParent();
            puremvc.Facade.getInstance().removeMediator(this.mediatorName);
            this.dispose();
        }
        onHide(): void {

        }
        dispose(): void {

        }




        //以下为复合继承FastChildGetter的设计模式，与业务逻辑无关，无需修改或扩展
        /** 用点语法路径快速查找对象的工具 */
        _fastChildGetter: comp.FastChildGetter;
        getChild(path: string): fairygui.GObject {
            return this._fastChildGetter.getChild(path);
        }
        getPath(gObject: fairygui.GObject): string {
            return this._fastChildGetter.getPath(gObject);
        }
    }




    export class SspWindow extends fairygui.Window implements puremvc.IMediator, puremvc.INotifier, ISspUi {

        openData: any;
        uipackage: fairygui.UIPackage;
        view: fairygui.GComponent;
        constructor(mdrName: string, pkgName: string, resName: string, userClass?: any) {
            super();
            this._mediator = new puremvc.Mediator(mdrName);
            this.pkgName = pkgName;
            this.resName = resName;
            this.userClass = userClass;
            this.modal = true;
        }
        pkgName: string;
        resName: string;
        userClass: any;

        getSound(name: string): egret.Sound {
            return this.uipackage.getItemAssetByName(name);
        }

        showUi(): void {
            this.show();
        }
        hideUi(): void {

        }
        protected onInit(): void {
            this.contentPane = fairygui.UIPackage.createObject(this.pkgName, this.resName, this.userClass).asCom;
            this.center();
            this.setPivot(0.5, 0.5);
            this._fastChildGetter = new comp.FastChildGetter(this.contentPane, this.onClick, this);
            puremvc.Facade.getInstance().registerMediator(this);
            this.view = this.contentPane;
            this._mediator.viewComponent = this.contentPane;
        }

        onClick(target: fairygui.GObject): void {

        }

        dispose(): void {
            puremvc.Facade.getInstance().removeMediator(this._mediator.mediatorName);
        }




        protected doShowAnimation(): void {
            this.setScale(0.1, 0.1);
            egret.Tween.get(this).set({ alpha: .5 }).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, egret.Ease.backOut).call(this.onShown, this);
        }

        protected doHideAnimation(): void {
            egret.Tween.get(this).to({ scaleX: 0.1, scaleY: 0.1, alpha: .5 }, 300, egret.Ease.backIn).call(this.hideImmediately, this);
        }




        //以下为复合继承FastChildGetter的设计模式，与业务逻辑无关，无需修改或扩展
        /** 用点语法路径快速查找对象的工具 */
        _fastChildGetter: comp.FastChildGetter;
        getChild(path: string): fairygui.GObject {
            return this._fastChildGetter.getChild(path);
        }
        getPath(gObject: fairygui.GObject): string {
            return this._fastChildGetter.getPath(gObject);
        }
        //以下为复合继承Mediator的设计模式，与业务逻辑无关，无需修改或扩展
        _mediator: puremvc.Mediator;
        getMediatorName(): string {
            return this._mediator.getMediatorName();
        }
        getViewComponent(): any {
            return this._mediator.getViewComponent();
        }
        setViewComponent(viewComponent: any): void {
            this._mediator.setViewComponent(viewComponent);
        }
        listNotificationInterests(): string[] {
            return this._mediator.listNotificationInterests();
        }
        handleNotification(notification: puremvc.INotification): void {
            this._mediator.handleNotification(notification);
        }
        onRegister(): void {
            this._mediator.onRegister();
        }
        onRemove(): void {
            this._mediator.onRemove();
        }
        sendNotification(name: string, body?: any, type?: string): void {
            this._mediator.sendNotification(name, body, type);
        }
    }



}
