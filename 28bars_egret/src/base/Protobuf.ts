module ssp {
	
    export var protobufCreator:any;

    export function getProtobufVO(className:string, data?:any):any {
        if(protobufCreator == null) {
            var mess = RES.getRes("protovos_proto");
            if(mess == null) return null;
            protobufCreator = dcodeIO.ProtoBuf.loadProto(mess); 
        }
        var VoClass = protobufCreator.build("ssp.protovos."+className);
        return data==null? new VoClass() : VoClass.decode(data);
    }

    export function getObjs(classType:any, data:any):any {
        var len = data.length;
        var arr = [];
        for (var i=0; i<len; ++i) {
            arr[i] = new classType(data[i]);
        }
        return arr;
    }

    export function getLongs(data:any):number[] {
        var len = data.length;
        var arr = [];
        for(var i = 0; i < len; ++i) {
            arr[i] = data[i] == null ? 0 : data[i].toNumber();
        }
        return arr;
    }

    export function getInts(data:any):number[] {
        var len = data.length;
        var arr = [];
        for(var i = 0; i < len; ++i) {
            arr[i] = data[i] == null ? 0 : data[i];
        }
        return arr;
    }
    
    
    
}
