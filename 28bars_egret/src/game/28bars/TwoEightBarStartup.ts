module twoeightbar {

	export class TwoEightBarStartup extends ssp.ModuleStartup {

		registerNet(): void {

		}

		registerUi(): void {
			ui.register(cst.ui.TWO_EIGHT_BAR, twoeightbar.TwoEightBarScreen);
		}

		startup(): void {
			this.moduleProxy = TwoEightBarProxy.inst;
			this.moduleProxy.setServer(cfg.hallServer, dat.hallServerInfoVO);
			super.startup();
			ui.open(cst.ui.TWO_EIGHT_BAR);
		}

	}
}
