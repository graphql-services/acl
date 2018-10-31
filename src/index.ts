import { PermissionList } from './model';

export { PermissionList } from './model';

export const checkPermissions = (
  permissions: string,
  resource: string
): boolean => {
  const p = new PermissionList(permissions);
  return p.isAllowed(resource);
};

export const getAttributes = (
  permissions: string,
  resource: string
): { [key: string]: any } => {
  const p = new PermissionList(permissions);
  return p.getAttributes(resource);
};
