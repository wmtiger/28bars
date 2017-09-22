var ssp;
(function (ssp) {
    function getProtobufVO(className, data) {
        if (ssp.protobufCreator == null) {
            var mess = RES.getRes("protovos_proto");
            if (mess == null)
                return null;
            ssp.protobufCreator = dcodeIO.ProtoBuf.loadProto(mess);
        }
        var VoClass = ssp.protobufCreator.build("ssp.protovos." + className);
        return data == null ? new VoClass() : VoClass.decode(data);
    }
    ssp.getProtobufVO = getProtobufVO;
    function getObjs(classType, data) {
        var len = data.length;
        var arr = [];
        for (var i = 0; i < len; ++i) {
            arr[i] = new classType(data[i]);
        }
        return arr;
    }
    ssp.getObjs = getObjs;
    function getLongs(data) {
        var len = data.length;
        var arr = [];
        for (var i = 0; i < len; ++i) {
            arr[i] = data[i] == null ? 0 : data[i].toNumber();
        }
        return arr;
    }
    ssp.getLongs = getLongs;
    function getInts(data) {
        var len = data.length;
        var arr = [];
        for (var i = 0; i < len; ++i) {
            arr[i] = data[i] == null ? 0 : data[i];
        }
        return arr;
    }
    ssp.getInts = getInts;
})(ssp || (ssp = {}));
//# sourceMappingURL=Protobuf.js.map