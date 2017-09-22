module ui {
    export class LoadingScreen extends SspScreen implements ILoadingScreen {

        static NAME: string = "LoadingScreen";

        constructor() {
            super(LoadingScreen.NAME);
            this.fairyPkgName = "loading";
            this.fairyResName = "Loading";
            this.resGroup = ["loading"];
            this.parentLayer = ui.loadingLayer;
        }

        _loader: utils.ResLoader;
        // _progress:fairygui.GProgressBar;
        _textField: fairygui.GTextField;


        onInit(): void {
            // this._progress = this.asCom.getChild("loadingbar").asCom.getChild("n0").asProgress;
            // this._progress.max = 1;
            this._textField = this.view.getChild("loadingTxt").asTextField;
        }


        _startLoading: boolean;
        onResLoaded(evt: egret.Event): void {
            if (!this._startLoading) {
                this._startLoading = true;
                this.showUi();
            }
            // this._progress.value = this._loader.progress;
            // this._textField.text = Math.floor(this._progress.value*100)+"%";
        }

        onResComplete(evt: egret.Event): void {
            this._loader.removeEventListener("loading", this.onResLoaded, this);
            this._loader.removeEventListener("complete", this.onResComplete, this);
            if (this._completeFunction != null) {
                this._completeFunction.apply(this._completeThisObj);
                this._completeFunction = null;
            }
        }

        _completeFunction: Function;
        _completeThisObj: any;
        load(groups: string[], complete: Function, thisObj: any): void {

            if (this._loader == null) {
                this._loader = new utils.ResLoader();
                this._loader.showTime = 500;
            }

            this._loader.addEventListener("loading", this.onResLoaded, this);
            this._loader.addEventListener("complete", this.onResComplete, this);
            this._completeFunction = complete;
            this._completeThisObj = thisObj;
            if (groups == null || groups.length == 0) {
                egret.log("显示的界面，没有指定所用到的资源组");
                return;
            }
            this._startLoading = false;
            this._loader.loadGroups(groups);
        }


        hideUi(): void {
            if (!this._startLoading) super.hideUi();
            else {
                egret.Tween.get(this.view)
                    .to({ alpha: 0 }, 1000)
                    .call(super.hideUi, this);
            }
        }



    }

}