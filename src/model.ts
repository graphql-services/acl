import { parse } from 'json5';
import merge from 'deepmerge';

type PermissionAttributes = { [key: string]: string } | null;

export class PermissionResourcePath {
  path: string;
  attributes: PermissionAttributes;

  constructor(path: string) {
    const matches = /^([^\(]+)(\(([^\)]+)\))?$/.exec(path);
    this.path = matches[1];
    this.attributes = (matches[3] && parse(`{${matches[3]}}`)) || null;
  }

  private _regexp: RegExp;
  isMatch = (resource: string): boolean => {
    if (!this._regexp) {
      this._regexp = new RegExp('^' + this.path.replace(/\*/g, '.*') + '$');
    }

    return this._regexp.test(resource);
  };
}

export class PermissionResource {
  paths: PermissionResourcePath[];

  constructor(resource: string) {
    const re = /([\?\*a-zA-Z0-9]+(\([^\)]+\))?):?/g;
    const results: string[] = [];
    let m = null;
    do {
      m = re.exec(resource);
      if (m) results.push(m[1]);
    } while (m);

    this.paths = results.map(x => new PermissionResourcePath(x));
  }

  isMatch = (resource: string): boolean => {
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

  getRuleForResource = (resource: string): PermissionResourcePath | null => {
    let index = resource.split(':').length - 1;
    if (index >= this.paths.length) {
      return null;
    }
    return this.paths[index];
  };

  getAttributes = (resource: string): PermissionAttributes | null => {
    const rule = this.getRuleForResource(resource);
    return (rule && rule.attributes) || null;
  };
}

export class PermissionRule {
  type: 'allow' | 'deny';
  resource: PermissionResource;

  constructor(rule: string) {
    const [type, resource] = rule.split('|');
    if (['allow', 'deny'].indexOf(type) === -1) {
      throw new Error(
        `unknown type ${type} (possible values 'allow' | 'deny')`
      );
    }
    this.type = type as 'allow' | 'deny';
    this.resource = new PermissionResource(resource);
  }

  isAllowed = (resource: string): boolean => {
    return this.type === 'allow' && this.resource.isMatch(resource);
  };

  isDenied = (resource: string): boolean => {
    return this.type === 'deny' && this.resource.isMatch(resource);
  };

  getAttributes = (resource: string): PermissionAttributes | null => {
    return (
      this.resource.isMatch(resource) && this.resource.getAttributes(resource)
    );
  };
}

export class PermissionList {
  rules: PermissionRule[] = [];

  constructor(permissions: string) {
    this.rules = permissions
      .split('\n')
      .filter(x => x)
      .map(line => new PermissionRule(line));
  }

  public isAllowed = (resource: string): boolean => {
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

  public getAttributes = (resource: string): PermissionAttributes => {
    const results = this.rules
      .map(x => x.getAttributes(resource))
      .filter(x => x);
    if (results.length === 0) {
      return null;
    }
    return results.reduce((prev, x) => merge(prev, x), {});
  };
}
