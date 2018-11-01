import { PermissionList, checkPermissions, getAttributes } from './';

describe('acl', () => {
  it('PermissionList', () => {
    const acl = new PermissionList(
      'allow|users:*name\n' + 'deny|users:password\n' + 'allow|tasks:*'
    );

    expect(acl.isAllowed('users:username')).toEqual(true);
    expect(acl.isAllowed('users:name')).toEqual(true);
    expect(acl.isAllowed('users:password')).toEqual(false);
    expect(acl.isAllowed('tasks:anything')).toEqual(true);
  });

  describe('permission functions', () => {
    const rules =
      'allow|users:*Name(id:"aa",bool:false,num:50.5,arr:[1])\ndeny|users:middleName\nallow|users(name:"John Doe"):firstName(arr:["aa"])';

    it('checkPermissions', () => {
      const checks = [
        { resource: 'users:firstName', result: true },
        { resource: 'users:middleName', result: false },
        { resource: 'users:somename', result: false },
        { resource: 'users:Name', result: true },
        { resource: 'users:name', result: false },
        { resource: 'users:Name', result: true },
        { resource: 'users:Name:aaa', result: true }
        { resource: 'users:somename:bbb', result: false }
      ];
      for (let check of checks) {
        expect(
          `${check.resource}->` + checkPermissions(rules, check.resource)
        ).toEqual(`${check.resource}->` + check.result);
      }
    });

    it('getAttributes', () => {
      const attributes = [
        {
          resource: 'users:firstName',
          attributes: { id: 'aa', bool: false, num: 50.5, arr: [1, 'aa'] }
        },
        {
          resource: 'users',
          attributes: { name: 'John Doe' }
        },
        {
          resource: 'users:somename',
          attributes: null
        },
        {
          resource: 'users:Name',
          attributes: { id: 'aa', bool: false, num: 50.5, arr: [1] }
        },
        {
          resource: 'users:Name:blah',
          attributes: null
        }
      ];
      for (let attribute of attributes) {
        expect(
          `${attribute.resource}->` +
            JSON.stringify(getAttributes(rules, attribute.resource))
        ).toEqual(
          `${attribute.resource}->` + JSON.stringify(attribute.attributes)
        );
      }
    });
  });
});
