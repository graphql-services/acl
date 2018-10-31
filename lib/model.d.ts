declare type PermissionAttributes = {
    [key: string]: string;
} | null;
export declare class PermissionResourcePath {
    path: string;
    attributes: PermissionAttributes;
    constructor(path: string);
    private _regexp;
    isMatch: (resource: string) => boolean;
}
export declare class PermissionResource {
    paths: PermissionResourcePath[];
    constructor(resource: string);
    isMatch: (resource: string) => boolean;
    getLatestRule: (resource: string) => PermissionResourcePath;
    getAttributes: (resource: string) => {
        [key: string]: string;
    };
}
export declare class PermissionRule {
    type: 'allow' | 'deny';
    resource: PermissionResource;
    constructor(rule: string);
    isAllowed: (resource: string) => boolean;
    isDenied: (resource: string) => boolean;
    getAttributes: (resource: string) => {
        [key: string]: string;
    };
}
export declare class PermissionList {
    rules: PermissionRule[];
    constructor(permissions: string);
    isAllowed: (resource: string) => boolean;
    getAttributes: (resource: string) => {
        [key: string]: string;
    };
}
export {};
