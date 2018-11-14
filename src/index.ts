import { PermissionList, PermissionRule } from './model';

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

export const getMatchingRules = (
  permissions: string,
  resource: string
): PermissionRule[] => {
  const p = new PermissionList(permissions);
  return p.getMatchingRules(resource);
};

export const getDenialRule = (
  permissions: string,
  resource: string
): PermissionRule | null => {
  const rules = getMatchingRules(permissions, resource);
  const lastRule = rules.length > 0 ? rules[rules.length - 1] : null;
  if (lastRule && lastRule.type === 'deny') {
    return lastRule;
  }
  return null;
};
