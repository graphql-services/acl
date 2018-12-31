"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
var model_2 = require("./model");
exports.PermissionList = model_2.PermissionList;
exports.PermissionRule = model_2.PermissionRule;
exports.checkPermissions = (permissions, resource, strict = false) => {
    const p = new model_1.PermissionList(permissions);
    return p.isAllowed(resource, strict);
};
exports.getAttributes = (permissions, resource) => {
    const p = new model_1.PermissionList(permissions);
    return p.getAttributes(resource);
};
exports.getMatchingRules = (permissions, resource, strict = false) => {
    const p = new model_1.PermissionList(permissions);
    return p.getMatchingRules(resource, strict);
};
exports.getDenialRule = (permissions, resource, strict = false) => {
    const rules = exports.getMatchingRules(permissions, resource, strict);
    const lastRule = rules.length > 0 ? rules[rules.length - 1] : null;
    if (lastRule && lastRule.type === 'deny') {
        return lastRule;
    }
    return null;
};
//# sourceMappingURL=index.js.map