var utils;
(function (utils) {
    function getXMLNode(xml, name) {
        var len = xml.children.length;
        for (var i = 0; i < len; ++i) {
            var xmlNode = xml.children[i];
            if (xmlNode.name == name) {
                return xmlNode.children[0].text;
            }
        }
        return null;
    }
    utils.getXMLNode = getXMLNode;
})(utils || (utils = {}));
//# sourceMappingURL=XmlUtils.js.map