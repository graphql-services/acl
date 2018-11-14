import { PermissionRule } from './model';
export { PermissionList } from './model';
export declare const checkPermissions: (permissions: string, resource: string) => boolean;
export declare const getAttributes: (permissions: string, resource: string) => {
    [key: string]: any;
};
export declare const getMatchingRules: (permissions: string, resource: string) => PermissionRule[];
export declare const getDenialRule: (permissions: string, resource: string) => PermissionRule;
