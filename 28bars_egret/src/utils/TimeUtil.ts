module utils {
	export class TimeUtil {
		public constructor() {
		}
	}

	export function getCrtTimeStamp() {
		let t = new Date();
		return t.getTime();
	}
}