module protovos {

	export class MessageVO {
		
		public action: number;

		public phase: number;

		public data: ParamVO;

		public sendAt: number;

		public futureId: number;

		public clientNumId: string;

		public name: string;

		public errorCode: number;

		public isEncrypt: boolean;

		public token: string;

		public seqNum: number;
	

		public static create(data?:any):MessageVO {
			return new MessageVO(ssp.getProtobufVO("MessageVO",data));
		}


		constructData:any;

		public constructor(data?: any) {

			if (data != null) {

				this.constructData = data;

				this.action = data.action;

				this.phase = data.phase;

				this.data = new ParamVO(data.data);

				this.sendAt = data.sendAt == null ? 0 : data.sendAt.toNumber();

				this.futureId = data.futureId == null ? 0 : data.futureId.toNumber();

				this.clientNumId = data.clientNumId;

				this.name = data.name;

				this.errorCode = data.errorCode;

				this.isEncrypt = data.isEncrypt;

				this.token = data.token;

				this.seqNum = data.seqNum;
			}
		}
		
	}
}
