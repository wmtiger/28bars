module cst {

	export const enum ui {
		LOADING,
		LOGIN = 10, //登录界面
		HALL = 20, //大厅界面
		USER_INFO, //用户信息界面
		SLOT = 100, //老虎机模块主界面
		SLOT_INFO, //老虎机说明界面
		SLOT_BOUNS, //老虎机的bouns界面
		FLIP = 200, //25张翻牌游戏
		TUITONG = 300, //推筒子
		TWO_EIGHT_BAR = 310, //二八杠
		LUCKY_PK_SIZE = 320, //幸运比牌
		FIGHT_GRID = 340, //战斗阵型
	}

	export const enum errCode {
		//系统相关
		SYSTEM_ERR = 1, //"系统错误"
		//玩家相关
		SYSTEM_USER_ERR = 101002, //"服户帐号错误"
		SYSTEM_USER_TOKEN_ERR = 101003, //"请重登陆"
		SYSTEM_NO_USER_ERR = 101004, //"没有玩家存在"
		SYSTEM_USER_MONEY_ERR = 101005, //"玩家资金不足"
		SYSTEM_USER_ACTIVE_TIME_ERR = 101006, //"时间没到"
		//游戏相关的
		GAME_START_BOUNS_ERR = 102001, //"玩家游戏在bouns 当中不能直接玩别的"
		GAME_START_FREEGAME_ERR = 101002, //"玩家游戏在FREEGAME 当中不能直接玩别的"
		GAME_START_JACKPOT_ERR = 102003, //"玩家游戏在JACKPOT 当中不能直接玩别的"
		GAME_START_BETNUM_ERR = 102004, //"下注档位有问题"
		GAME_LEVEL_ERR = 102005, //"等级不够"
		GAME_VIP_LEVEL_ERR = 102006, //"VIP等级不够"
		USER_BINDING_ERR = 102007, //"玩家已绑定"
		USER_BINDING_FACEBOOK_ERR = 102008, //"第三方验证失败"
	}




	export const enum svrID {
		LOGIN = 1,
		HALL = 2,
		SLOTS = 3,
	}


	export class SvrAct {

		static LOGIN: number = 2000000; //账号登录

		static HALL_LOGIN: number = 1; //登录到大厅
		static HALL_HEART: number = 2000001; //领取活跃奖励
		static HALL_ACTIVE: number = 2000002; //领取活跃奖励

		static SLOT_LOGIN: number = 1; //登录到老虎机游戏
		static SLOT_PLAYGAME: number = 9000000; //Slots
		static SLOT_FREEGAME: number = 9000001; //Slots
		static SLOT_BOUNS: number = 9000002; //Slots
		static SLOT_JACKPOT: number = 9000003; //Slots

	}

}