module tuitong {

	export class TuitongStartup extends ssp.ModuleStartup {

		registerNet(): void {

		}

		registerUi(): void {
			ui.register(cst.ui.TUITONG, ui.TuitongScreen);
		}

		startup(): void {
			this.moduleProxy = TuitongProxy.inst;
			this.moduleProxy.setServer(cfg.hallServer, dat.hallServerInfoVO);
			super.startup();
			ui.open(cst.ui.TUITONG);
		}

	}
}
