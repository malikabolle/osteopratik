"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHashed = function (str) {
    var matches = str.toString().match(/(.+?)(-)(.{20})/);
    return !!matches;
};
exports.toArray = function (obj) {
    var items = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            items.push(__assign({}, obj[k], { $key: k }));
        }
    }
    return items;
};
