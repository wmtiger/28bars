module fg {
	export class FightGridStartup extends ssp.ModuleStartup {

		registerNet(): void {

		}

		registerUi(): void {
			ui.register(cst.ui.FIGHT_GRID, fg.FightGridScreen);
		}

		startup(): void {
			this.moduleProxy = FightGridProxy.inst;
			this.moduleProxy.setServer(cfg.hallServer, dat.hallServerInfoVO);
			super.startup();
			ui.open(cst.ui.FIGHT_GRID);
		}

	}
}
