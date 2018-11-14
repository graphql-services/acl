"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json5_1 = require("json5");
const mergeFn = require("deepmerge");
const merge = mergeFn.default || mergeFn;
class PermissionResourcePath {
    constructor(path) {
        this.isMatch = (resource) => {
            if (!this._regexp) {
                this._regexp = new RegExp('^' + this.path.replace(/\*/g, '.*') + '$');
            }
            return this._regexp.test(resource);
        };
        const matches = /^([^\(]+)(\(([^\)]+)\))?$/.exec(path);
        this.path = matches[1];
        this.attributes = (matches[3] && json5_1.parse(`{${matches[3]}}`)) || null;
    }
}
exports.PermissionResourcePath = PermissionResourcePath;
class PermissionResource {
    constructor(resource) {
        this.isMatch = (resource, strict = true) => {
            const resourcePaths = resource.split(':');
            if (strict && this.paths.length > resourcePaths.length) {
                return false;
            }
            for (let i in resourcePaths) {
                const path = this.paths[i];
                const resourcePath = resourcePaths[i];
                if (!path) {
                    const lastPath = this.paths[this.paths.length - 1].path;
                    return lastPath[lastPath.length - 1] === '*';
                }
                if (!path.isMatch(resourcePath)) {
                    return false;
                }
            }
            return true;
        };
        this.getRuleForResource = (resource) => {
            let index = resource.split(':').length - 1;
            if (index >= this.paths.length) {
                return null;
            }
            return this.paths[index];
        };
        this.getAttributes = (resource) => {
            const rule = this.isMatch(resource, false) && this.getRuleForResource(resource);
            return (rule && rule.attributes) || null;
        };
        const re = /([\?\*a-zA-Z0-9]+(\([^\)]+\))?):?/g;
        const results = [];
        let m = null;
        do {
            m = re.exec(resource);
            if (m)
                results.push(m[1]);
        } while (m);
        this.paths = results.map(x => new PermissionResourcePath(x));
    }
    toString() {
        return this.paths.map(x => x.path).join(':');
    }
}
exports.PermissionResource = PermissionResource;
class PermissionRule {
    constructor(rule) {
        this.isMatch = (resource) => {
            return this.resource.isMatch(resource);
        };
        this.isAllowed = (resource) => {
            return this.type === 'allow' && this.isMatch(resource);
        };
        this.isDenied = (resource) => {
            return this.type === 'deny' && this.isMatch(resource);
        };
        this.getAttributes = (resource) => {
            if (this.type === 'deny') {
                return null;
            }
            return this.resource.getAttributes(resource);
        };
        const [type, resource] = rule.split('|');
        if (['allow', 'deny'].indexOf(type) === -1) {
            throw new Error(`unknown type ${type} (possible values 'allow' | 'deny')`);
        }
        this.type = type;
        this.resource = new PermissionResource(resource);
    }
    toString() {
        return this.type + '|' + this.resource.toString();
    }
}
exports.PermissionRule = PermissionRule;
class PermissionList {
    constructor(permissions) {
        this.rules = [];
        this.isAllowed = (resource) => {
            let allowed = false;
            for (let rule of this.getMatchingRules(resource)) {
                if (rule.type === 'allow') {
                    allowed = true;
                }
                else if (rule.type === 'deny') {
                    allowed = false;
                    break;
                }
            }
            return allowed;
        };
        this.getMatchingRules = (resource) => {
            let result = [];
            for (let rule of this.rules) {
                if (rule.isMatch(resource)) {
                    result.push(rule);
                    if (rule.type === 'deny') {
                        break;
                    }
                }
            }
            return result;
        };
        this.getAttributes = (resource) => {
            const results = this.rules
                .map(x => x.getAttributes(resource))
                .filter(x => x);
            if (results.length === 0) {
                return null;
            }
            return results.reduce((prev, x) => merge(prev, x), {});
        };
        this.rules = permissions
            .split('\n')
            .filter(x => x)
            .map(line => new PermissionRule(line));
    }
}
exports.PermissionList = PermissionList;
//# sourceMappingURL=model.js.map