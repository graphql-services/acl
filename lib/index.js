"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
exports.checkPermissions = (permissions, resource) => {
    const p = new model_1.Permission(permissions);
    return p.isAllowed(resource);
};
exports.getAttributes = (permissions, resource) => {
    const p = new model_1.Permission(permissions);
    return p.getAttributes(resource);
};
//# sourceMappingURL=index.js.map