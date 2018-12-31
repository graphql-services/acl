import { PermissionRule } from './model';
export { PermissionList, PermissionRule } from './model';
export declare const checkPermissions: (permissions: string, resource: string, strict?: boolean) => boolean;
export declare const getAttributes: (permissions: string, resource: string) => {
    [key: string]: any;
};
export declare const getMatchingRules: (permissions: string, resource: string, strict?: boolean) => PermissionRule[];
export declare const getDenialRule: (permissions: string, resource: string, strict?: boolean) => PermissionRule;
