export { PermissionList } from './model';
export declare const checkPermissions: (permissions: string, resource: string) => boolean;
export declare const getAttributes: (permissions: string, resource: string) => {
    [key: string]: any;
};
