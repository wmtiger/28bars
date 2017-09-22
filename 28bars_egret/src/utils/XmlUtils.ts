module utils {

    export function getXMLNode(xml:egret.XML, name:string):string {
        var len = xml.children.length;
        for (var i=0; i<len; ++i) {
            var xmlNode = <any>xml.children[i];
            if (xmlNode.name == name) {
                return xmlNode.children[0].text
            }
        }
        return null;
    }
}