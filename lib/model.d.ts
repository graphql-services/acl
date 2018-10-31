export declare class PermissionResourcePath {
    path: string;
    private _arguments;
    readonly arguments: {
        [key: string]: string;
    };
    constructor(path: string);
    private _regexp;
    isMatch: (resource: string) => boolean;
}
export declare class PermissionResource {
    paths: PermissionResourcePath[];
    constructor(resource: string);
    isMatch: (resource: string) => boolean;
}
export declare class PermissionRule {
    type: 'allow' | 'deny';
    resource: PermissionResource;
    constructor(rule: string);
    isAllowed: (resource: string) => boolean;
    isDenied: (resource: string) => boolean;
    toString(): string;
}
export declare class Permission {
    rules: PermissionRule[];
    constructor(permissions: string);
    isAllowed: (resource: string) => boolean;
    getAttributes: (resource: string) => {
        [key: string]: any;
    };
}
