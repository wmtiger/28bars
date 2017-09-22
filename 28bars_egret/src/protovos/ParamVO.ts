module protovos {

	export class ParamVO {

		public strValues: string[] = [];

		public intValues: number[] = [];

		public longValues: number[] = [];

		public data: any[] = [];


		public static create(data?: any): ParamVO {
			return new ParamVO(ssp.getProtobufVO("ParamVO").decode(data));
		}


		constructData: any;

		public constructor(data: any = null) {

			if (data != null) {

				this.constructData = data;

				var i: number = 0; var len: number = 0;

				this.strValues = []; len = data.strValues.length; for (i = 0; i < len; i++) { this.strValues[i] = data.strValues[i]; }

				this.intValues = []; len = data.intValues.length; for (i = 0; i < len; i++) { this.intValues[i] = data.intValues[i]; }

				this.longValues = []; len = data.longValues.length; for (i = 0; i < len; i++) { this.longValues[i] = data.longValues[i] == null ? 0 : data.longValues[i].toNumber(); }

				this.data = []; len = data.data.length; for (i = 0; i < len; i++) { this.data[i] = data.data[i]; }

			}
		}
	}
}
