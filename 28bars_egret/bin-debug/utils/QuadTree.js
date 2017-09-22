var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var utils;
(function (utils) {
    // export class QuadTreeUtils {
    // 	public constructor() {
    // 	}
    // }
    function isHit(obj1, obj2) {
        var rect1 = obj1.getHitRect();
        var rect2 = obj2.getHitRect();
        var left = rect1.x < rect2.x ? rect1 : rect2;
        var right = rect1.x >= rect2.x ? rect1 : rect2;
        if (left.x + left.width >= right.x) {
            if (left.y < right.y) {
                if (left.y + left.height >= right.y) {
                    return true;
                }
            }
            else {
                if (right.y + right.height >= left.y) {
                    return true;
                }
            }
        }
        return false;
    }
    utils.isHit = isHit;
    function isInViewport(obj, viewportRect) {
        var objRect = obj.getHitRect();
        if (objRect.x + objRect.width > viewportRect.x &&
            objRect.y + objRect.height > viewportRect.y &&
            objRect.x < viewportRect.x + viewportRect.width &&
            objRect.y < viewportRect.y + viewportRect.height) {
            return true;
        }
        return false;
    }
    utils.isInViewport = isInViewport;
    /**QuadTree */
    var QuadTree = (function () {
        function QuadTree(lv, rect) {
            this.level = 0;
            this.level = lv;
            this.objs = [];
            this.rect = rect;
            this.nodes = [];
        }
        /** 清理当前所有的字节点 */
        QuadTree.prototype.clear = function () {
            this.objs = [];
            this.nodes.forEach(function (n) { return n.clear(); });
            this.nodes = [];
        };
        /**将当前子节点均分成4块 */
        QuadTree.prototype.split = function () {
            var dw = this.rect.width / 2;
            var dh = this.rect.height / 2;
            var x = this.rect.x;
            var y = this.rect.y;
            this.nodes[0] = new QuadTree(this.level + 1, new egret.Rectangle(x + dw, y, dw, dh)); // 右上
            this.nodes[1] = new QuadTree(this.level + 1, new egret.Rectangle(x + dw, y + dh, dw, dh)); // 右下
            this.nodes[2] = new QuadTree(this.level + 1, new egret.Rectangle(x, y + dh, dw, dh)); // 左下
            this.nodes[3] = new QuadTree(this.level + 1, new egret.Rectangle(x, y, dw, dh)); // 左上
        };
        /** 判断物体属于哪个节点 在线上为父节点，返回-1 */
        QuadTree.prototype.getIdx = function (objRect) {
            // let objRect = obj.getHitRect();
            var idx = -1;
            var isUp = objRect.y + objRect.height < this.rect.height / 2; // 完全属于上面象限
            var isDown = objRect.y > this.rect.height / 2; // 完全属于下面象限
            var isLeft = objRect.x + objRect.width < this.rect.width / 2; // 完全属于左边象限
            var isRight = objRect.x > this.rect.width / 2; // 完全属于右面象限
            var isHorLine = !isUp && !isDown;
            var isVerLine = !isLeft && !isRight;
            if (isUp && isRight) {
                idx = 0;
            }
            else if (isDown && isRight) {
                idx = 1;
            }
            else if (isDown && isLeft) {
                idx = 2;
            }
            else if (isUp && isLeft) {
                idx = 3;
            }
            return idx;
        };
        /** 插入节点 */
        QuadTree.prototype.insert = function (obj) {
            if (this.nodes.length > 0) {
                var idx = this.getIdx(obj.getHitRect());
                if (idx > -1) {
                    this.nodes[idx].insert(obj);
                    return;
                }
            }
            this.objs.push(obj);
            if (this.objs.length > QuadTree.MAX_CHILDREN && this.level < QuadTree.MAX_LEVEL) {
                if (this.nodes.length <= 0) {
                    this.split();
                }
                var objsIdx = this.objs.length - 1;
                while (objsIdx > 0) {
                    var tempObj = this.objs[objsIdx];
                    var tidx = this.getIdx(tempObj.getHitRect());
                    if (tidx > -1) {
                        this.nodes[tidx].insert(tempObj);
                        this.objs.splice(this.objs.indexOf(tempObj), 1);
                    }
                    objsIdx--;
                }
            }
        };
        /** 获取碰撞列表 */
        QuadTree.prototype.retrieve = function (obj) {
            var result = [];
            if (this.nodes.length > 0) {
                var idx = this.getIdx(obj.getHitRect());
                if (idx > -1) {
                    result = result.concat(this.nodes[idx].retrieve(obj));
                }
                else {
                    var arr = this.cut(obj.getHitRect());
                    for (var i = 0; i < arr.length; i++) {
                        result = result.concat(this.nodes[arr[i]].retrieve(obj));
                    }
                }
            }
            result = result.concat(this.objs);
            return result;
        };
        QuadTree.prototype._isUp = function (objRect) {
            return objRect.y + objRect.height > this.rect.y &&
                objRect.y + objRect.height < this.rect.height / 2; // 完全属于上面象限
        };
        QuadTree.prototype._isDown = function (objRect) {
            return objRect.y + objRect.height < this.rect.y + this.rect.height &&
                objRect.y > this.rect.height / 2; // 完全属于上面象限
        };
        /** 分割矩形，如果矩形在象限线上，就将他所在的所有象限都包括进去计算 */
        QuadTree.prototype.cut = function (objRect) {
            var arr = [];
            var isUp = objRect.y + objRect.height < this.rect.height / 2; // 完全属于上面象限
            var isDown = objRect.y > this.rect.height / 2; // 完全属于下面象限
            var isLeft = objRect.x + objRect.width < this.rect.width / 2; // 完全属于左边象限
            var isRight = objRect.x > this.rect.width / 2; // 完全属于右面象限
            var isHorLine = !isUp && !isDown;
            var isVerLine = !isLeft && !isRight;
            if (isHorLine && !isVerLine) {
                if (isLeft) {
                    arr = [2, 3];
                }
                else {
                    arr = [0, 1];
                }
            }
            else if (!isHorLine && isVerLine) {
                if (isUp) {
                    arr = [0, 3];
                }
                else {
                    arr = [2, 1];
                }
            }
            else if (isHorLine && isVerLine) {
                arr = [0, 1, 2, 3];
            }
            return arr;
        };
        /** 是否在当前节点区域中 */
        QuadTree.prototype.isInner = function (objRect) {
            var isOutRight = objRect.x > this.rect.x + this.rect.width;
            var isOutLeft = objRect.x + objRect.width < this.rect.x;
            var isOutDown = objRect.y > this.rect.y + this.rect.height;
            var isOutUp = objRect.y + objRect.height < this.rect.y;
            if (isOutUp && isOutDown && isOutLeft && isOutRight) {
                return false;
            }
            return true;
        };
        QuadTree.prototype.refresh = function (root) {
            var len = this.objs.length;
            for (var i = len - 1; i >= 0; i--) {
                var obj = this.objs[i];
                var idx = this.getIdx(obj.getHitRect());
                var isInner = this.isInner(obj.getHitRect());
                if (isInner) {
                    if (this.nodes.length > 0) {
                        this.nodes[idx].insert(this.objs.splice(i, 1)[0]);
                    }
                }
                else {
                    root.insert(this.objs.splice(i, 1)[0]);
                }
            }
            for (var i = 0; i < this.nodes.length; i++) {
                var nt = this.nodes[i];
                nt.refresh(root);
            }
        };
        QuadTree.MAX_LEVEL = 5; // 往下最大的扩展层级
        QuadTree.MAX_CHILDREN = 10; // 每个层级最大的物体数量
        return QuadTree;
    }());
    utils.QuadTree = QuadTree;
    __reflect(QuadTree.prototype, "utils.QuadTree");
})(utils || (utils = {}));
//# sourceMappingURL=QuadTree.js.map