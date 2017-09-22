  module protovos {

	export class UserVO {

		public userId: string;

		public userName: string;

		public points: number; //财富

		public vip: number; //vip等级

		public vipPoint: number; //vip 经验值

		public level: number; // 等级

		public levelPoint: number; // 经验值

		public startTime: number; // 开始玩的时间

		public maxWinPoint: number; // 最大赢的钱

		public winTimes: number; //获利次数

		public userDayActiveTime: number; //可以领奖的时间(毫秒)
	

		public static create(data?:any):UserVO {
			return new UserVO(ssp.getProtobufVO("UserVO",data));
		}


		constructData:any;

		public constructor(data?: any) {

			if (data != null) {

				this.constructData = data;

				this.userId = data.userId;

				this.userName = data.userName;

				this.points = data.points == null ? 0 : data.points.toNumber();

				this.vip = data.vip == null ? 0 : data.vip.toNumber();

				this.vipPoint = data.vipPoint == null ? 0 : data.vipPoint.toNumber();

				this.level = data.level == null ? 0 : data.level.toNumber();

				this.levelPoint = data.levelPoint == null ? 0 : data.levelPoint.toNumber();

				this.startTime = data.startTime == null ? 0 : data.startTime.toNumber();

				this.maxWinPoint = data.maxWinPoint == null ? 0 : data.maxWinPoint.toNumber();

				this.winTimes = data.winTimes == null ? 0 : data.winTimes.toNumber();

				this.userDayActiveTime = data.userDayActiveTime == null ? 0 : data.userDayActiveTime.toNumber();
			}
		}
		
	}
}