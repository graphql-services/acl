import { PermissionList, PermissionRule } from './model';

export { PermissionList, PermissionRule } from './model';

export const checkPermissions = (
  permissions: string,
  resource: string,
  strict = false
): boolean => {
  const p = new PermissionList(permissions);
  return p.isAllowed(resource, strict);
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
  resource: string,
  strict = false
): PermissionRule[] => {
  const p = new PermissionList(permissions);
  return p.getMatchingRules(resource, strict);
};

export const getDenialRule = (
  permissions: string,
  resource: string,
  strict = false
): PermissionRule | null => {
  const rules = getMatchingRules(permissions, resource, strict);
  const lastRule = rules.length > 0 ? rules[rules.length - 1] : null;
  if (lastRule && lastRule.type === 'deny') {
    return lastRule;
  }
  return null;
};
