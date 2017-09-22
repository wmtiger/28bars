module lps {

	export class LuckyPkSizeStartup extends ssp.ModuleStartup {

		registerNet(): void {

		}

		registerUi(): void {
			ui.register(cst.ui.LUCKY_PK_SIZE, lps.LuckyPkSizeScreen);
		}

		startup(): void {
			this.moduleProxy = LuckyPkSizeProxy.inst;
			this.moduleProxy.setServer(cfg.hallServer, dat.hallServerInfoVO);
			super.startup();
			ui.open(cst.ui.LUCKY_PK_SIZE);
		}

	}
}
