  module protovos {

	export class ServerInfoVO {

		public processId: number; //服务器进程

		public ip: string;

		public onlineNum: number; //在线人数

		public tport: number; //

		public wport: number; //

		public hport: number; //

		public gameId: number; //

		public modelId: number; //服务器类型

		public gameName: string; //


		public static create(data?:any):ServerInfoVO {
			return new ServerInfoVO(ssp.getProtobufVO("ServerInfoVO",data));
		}


		constructData:any;

		public constructor(data?: any) {

			if (data != null) {

				this.constructData = data;

				this.processId = data.processId;

				this.ip = data.ip;

				this.onlineNum = data.onlineNum;

				this.tport = data.tport;

				this.wport = data.wport;

				this.hport = data.hport;

				this.gameId = data.gameId;

				this.modelId = data.modelId;

				this.gameName = data.gameName;
			}
		}
		
	}
}