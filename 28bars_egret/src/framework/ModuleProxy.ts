module ssp {

	export class ModuleProxy {

		serverInfo: protovos.ServerInfoVO;

		sspServer: net.SspServer;

		isLogined: boolean;

		setServer(sspServer: net.SspServer, serverInfo?: protovos.ServerInfoVO): void {
			this.sspServer = sspServer;
			if (serverInfo == null) {
				this.serverInfo = this.sspServer.serverInfo;
			} else {
				this.sspServer.serverInfo = serverInfo;
				this.serverInfo = serverInfo;
			}
		}

	}

}
