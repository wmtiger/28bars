module utils {

    /** 将大数字显示成万的模式 */
    export function wan(value: number): string {
        var flg:string = ""
        if (value < 0) {
            flg = "-";
            value = -value;
        } 
        if(value>=10000000) {
           return flg+(Math.floor(value/100000)/100)+"千万";
            
        } else if(value >= 1000000) {
           return flg+Math.floor(value/10000)+"万";
           
        } else if (value >= 100000) {
           return flg+(Math.floor(value/1000)/10)+"万";
           
        } else if (value >= 10000) {
           return flg+(Math.floor(value/100)/100)+"万";
        } 
        
        return flg+value;
    }

    // number to string format (多选)
    /**指定最少的整数部分长度(不足,前面补零)*/
    export const NTSF_L = 1; 
    /**指定最少的小数部分长度(不足,末尾补零)*/
    export const NTSF_D = 2; 
    /** 按千分位在整数部分增加逗号分隔符 */
    export const NTSF_K = 4;
    /** 指定数字精度，
     * 扩展参数
     * 第一位len 表示精确的位置如2表示小数点后2位，0表示取整，-2表示精确到100
     * 第二位type 1或大于0表示全进，0或忽略表示四舍五入，-1或小于0表示全舍 */
    export const NTSF_F = 8;

    export function numberFormat(value: number, format:number, ...args): string {

        var str = value.toString(); //数字的字符串形式

        if (format & NTSF_F) {
            var len = args[0]; //精度
            var type = args[1]||0; //方式
            if (len>0) {
                //精确到小数
                str = value.toFixed(len); 
            } else if(len<0) {
                //精确到10的倍数
                var p = Math.pow(10,-len);
                if (type==0) { //四舍五入
                    value = Math.round(Math.round(value / p) * p);
                } else {
                    value = Math.floor(value / p);
                    if (type>0) ++value;
                    value = Math.round(value * p);
                }
                str = value.toString();
            } else {
                //精确到整数
                value = type==0 ? Math.round(value) : Math.floor(value);
                if (type>0) ++value;
                str = value.toString();
            }
        }


        var dot = str.indexOf("."); //小数点的位置
        var sLen = str.length; //整个数字的长度
        var iLen = dot==-1? sLen : dot; //整数部分的长度,可做整数部分的倒序遍历起点
        var dLen = dot==-1? 0 : sLen-dot-1; //小数部分的长度，起点为dot+1

        if(format & NTSF_L) {
            var len = args[0];
            for(var i=0; i<len; ++i) {
                str = "0" + str;
            }
        }

        if(format & NTSF_D) {
            var len = args[1];
            if(isNaN(len)) len = args[0];
            for(var i=0; i<len; ++i) {
                str += "0";
            }
        }

        if(format & NTSF_K) {
            var resv = str.substr(iLen);
            for (var i=iLen-1,nk=0; i>=0; --i) {
                resv = str.charAt(i) + resv;
                if (++nk==3&&i>0) {
                    resv = "," + resv;
                    nk = 0;
                }
            }
            str = resv;
        }

        return str;
    }


    /**1天的毫秒数 3600 * 1000 * 24 */
    export const DAY_TIME:number = 86400000;
    /**1年(非闰年)的毫秒数 DAY_TIME * 365 */
    export const YEAR_TIME:number = 31536000000;

    /** 自定义任何格式用字符串显示时间
     *  MM月dd日 = 10月10日
     *  hh:mm = 10:10      */
    export function dateFormat(dateTime: any, fmt: string, utc:boolean=false): string {
        var date:Date;
        if(dateTime instanceof Date) date = dateTime;
        if(!isNaN(dateTime)) date = new Date(dateTime);
        if(date == null) return "";
        var o = {
            "M+": (utc?date.getUTCMonth():date.getMonth()) + 1,                  //月份   
            "d+": utc?date.getUTCDate():date.getDate(),                          //日   
            "h+": utc?date.getUTCHours():date.getHours(),                        //小时   
            "m+": utc?date.getUTCMinutes():date.getMinutes(),                    //分   
            "s+": utc?date.getUTCSeconds():date.getSeconds(),                    //秒   
            "q+": Math.floor(((utc?date.getUTCMonth():date.getMonth()) + 3) / 3),//季度   
            "S": utc?date.getUTCMilliseconds():date.getMilliseconds()            //毫秒   
        };
        var fullYear:string = String(utc?date.getUTCFullYear():date.getFullYear());
        if(/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1,fullYear.substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1,(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }



    export function bytesHex(data:any):string {
        var dv:DataView;
        if (data instanceof egret.ByteArray) {
            dv = data.dataView;
        } else if (data instanceof DataView) {
            dv = data;
        } else if (data instanceof ArrayBuffer) {
            dv = new DataView(data);
        } else return "";

        var len = dv.byteLength;
        var str = "[" + dv.getUint8(0);
        for (var i=1; i<len; ++i) {
            str += ", " + dv.getUint8(i);
        }
        str += "]";
        return str;
    }

    export function buffStr(data:any):string {
        var dv:DataView;
        if(data.dataView instanceof DataView) {
            dv = data.dataView;
        } else if (data.buffer instanceof ArrayBuffer) {
            dv = new DataView(data.buffer);
        } else if (data instanceof DataView) {
            dv = data;
        } else if (data instanceof ArrayBuffer) {
            dv = new DataView(data);
        } else return "";
        var len = dv.byteLength;
        var str:string = "";
        for (var i=0; i<len; ++i) {
            var subStr:string = dv.getUint8(i).toString(16);
            str += subStr.length==1? ("0"+subStr) : subStr;
        }
        return str;
    }

    export function strBuff(data:string):ArrayBuffer {
        if(data==null||data.length==0) return null;
        if(data.length/2!=Math.floor(data.length/2)) {
            data = "0" + data;
        }
        var len = data.length / 2;
        var dv:DataView = new DataView(new ArrayBuffer(len));
        for (var i=0; i<len; ++i) {
            dv.setInt8(i,parseInt(data.substr(i*2,2),16));
        }
        return dv.buffer;
    }
    
    
}