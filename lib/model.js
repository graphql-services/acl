"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PermissionResourcePath {
    constructor(path) {
        this.isMatch = (resource) => {
            if (!this._regexp) {
                this._regexp = new RegExp('^' + this.path.replace(/\*/g, '.*') + '$');
            }
            return this._regexp.test(resource);
        };
        this.path = path;
    }
    get arguments() {
        return this._arguments || {};
    }
}
exports.PermissionResourcePath = PermissionResourcePath;
class PermissionResource {
    constructor(resource) {
        this.isMatch = (resource) => {
            const resourcePaths = resource.split(':');
            for (let i in resourcePaths) {
                const path = this.paths[i];
                if (!path) {
                    return true;
                }
                if (!path.isMatch(resourcePaths[i])) {
                    return false;
                }
            }
            return true;
        };
        this.paths = resource
            .split(':')
            .filter(x => x)
            .map(x => new PermissionResourcePath(x));
    }
}
exports.PermissionResource = PermissionResource;
class PermissionRule {
    constructor(rule) {
        this.isAllowed = (resource) => {
            return this.type === 'allow' && this.resource.isMatch(resource);
        };
        this.isDenied = (resource) => {
            return this.type === 'deny' && this.resource.isMatch(resource);
        };
        const [type, resource] = rule.split('|');
        if (['allow', 'deny'].indexOf(type) === -1) {
            throw new Error(`unknown type ${type} (possible values 'allow' | 'deny')`);
        }
        this.type = type;
        this.resource = new PermissionResource(resource);
    }
    toString() {
        return `${this.type}|${this.resource}`;
    }
}
exports.PermissionRule = PermissionRule;
class Permission {
    constructor(permissions) {
        this.rules = [];
        this.isAllowed = (resource) => {
            let allowed = false;
            for (let rule of this.rules) {
                if (rule.isAllowed(resource)) {
                    allowed = true;
                }
                if (rule.isDenied(resource)) {
                    allowed = false;
                    break;
                }
            }
            return allowed;
        };
        this.getAttributes = (resource) => {
            return {};
        };
        this.rules = permissions
            .split('\n')
            .filter(x => x)
            .map(line => new PermissionRule(line));
    }
}
exports.Permission = Permission;
//# sourceMappingURL=model.js.map