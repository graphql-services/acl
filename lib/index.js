"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
var model_2 = require("./model");
exports.PermissionList = model_2.PermissionList;
exports.checkPermissions = (permissions, resource) => {
    const p = new model_1.PermissionList(permissions);
    return p.isAllowed(resource);
};
exports.getAttributes = (permissions, resource) => {
    const p = new model_1.PermissionList(permissions);
    return p.getAttributes(resource);
};
//# sourceMappingURL=index.js.map