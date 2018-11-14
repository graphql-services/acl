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
exports.getMatchingRules = (permissions, resource) => {
    const p = new model_1.PermissionList(permissions);
    return p.getMatchingRules(resource);
};
exports.getDenialRule = (permissions, resource) => {
    const rules = exports.getMatchingRules(permissions, resource);
    const lastRule = rules.length > 0 ? rules[rules.length - 1] : null;
    if (lastRule && lastRule.type === 'deny') {
        return lastRule;
    }
    return null;
};
//# sourceMappingURL=index.js.map