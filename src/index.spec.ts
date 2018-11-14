import {
  PermissionList,
  checkPermissions,
  getAttributes,
  getDenialRule
} from './';

describe('acl', () => {
  it('PermissionList', () => {
    const acl = new PermissionList(
      'allow|users(blah:"foo"):*name(hello:"world",id:123)\n' +
        'deny|users:password\n' +
        'allow|tasks:*'
    );

    expect(acl.isAllowed('users:username')).toEqual(true);
    expect(acl.isAllowed('users:name')).toEqual(true);
    expect(acl.isAllowed('users:password')).toEqual(false);
    expect(acl.isAllowed('tasks:anything')).toEqual(true);

    expect(acl.getAttributes('users')).toEqual({ blah: 'foo' });
    expect(acl.getAttributes('users:first_name')).toEqual({
      hello: 'world',
      id: 123
    });
  });

  describe('permission functions', () => {
    const rules =
      'allow|users:*Name(id:"aa",bool:false,num:50.5,arr:[1])\ndeny|users:middleName\ndeny|users:firstName:test\nallow|users(name:"John Doe"):firstName(arr:["aa"])';

    it('checkPermissions', () => {
      const checks = [
        { resource: 'users:firstName', result: true },
        { resource: 'users:middleName', result: false },
        { resource: 'users:somename', result: false },
        { resource: 'users:Name', result: true },
        { resource: 'users:name', result: false },
        { resource: 'users:Name', result: true },
        { resource: 'users:Name:aaa', result: false },
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

  describe('permission functions with wildcard', () => {
    const rules =
      'allow|roles*:*\nallow|users:test:*\ndeny|users:test:hello\nallow|car:brand';

    it('checkPermissions', () => {
      const checks = [
        { resource: 'roles:blah', result: true },
        { resource: 'rolesXxaer:blah', result: true },
        { resource: 'users:test:aaa', result: true },
        { resource: 'car:brand', result: true },
        { resource: 'car:brand:aaa', result: false },
        { resource: 'users:test', result: false },
        { resource: 'users:test:hello', result: false },
        { resource: 'users:test:hello:aa', result: true }
      ];
      for (let check of checks) {
        expect(
          `${check.resource}->` + checkPermissions(rules, check.resource)
        ).toEqual(`${check.resource}->` + check.result);
      }
    });
  });

  describe('other permissions', () => {
    const rules = [
      `allow|jobs(filter:{doctor:{id:"aaa"}})`,
      `allow|job(id:5,filter:{doctor:{id:"aaa"}})`,
      `allow|file*`,
      `allow|comment*`,
      `deny|job:transferToCooperatingTechnicianDate`,
      `deny|job:cooperatingTechnician`,
      `deny|job:detail`
    ].join('\n');

    it('check permissions', () => {
      const checks = [
        {
          resource: 'job',
          result: true,
          denialRule: null
        },
        {
          resource: 'Query:job',
          result: false,
          denialRule: null
        },
        { resource: 'files', result: true, denialRule: null },
        { resource: 'job:detail', result: false, denialRule: `deny|job:detail` }
      ];
      for (let check of checks) {
        expect(
          `${check.resource}->` + checkPermissions(rules, check.resource)
        ).toEqual(`${check.resource}->` + check.result);

        const rule = getDenialRule(rules, check.resource);
        expect(
          `${check.resource}->${(rule && rule.toString()) || null}`
        ).toEqual(`${check.resource}->${check.denialRule}`);
      }
    });
  });
});
