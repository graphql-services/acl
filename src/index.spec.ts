import {
  PermissionList,
  checkPermissions,
  getAttributes,
  getDenialRule
} from './';

describe('acl', () => {
  it('PermissionList', () => {
    const acl = new PermissionList(
      [
        'allow|users(blah:"foo"):*name(hello:"world",id:123)',
        'deny|users:password',
        'allow|tasks:*'
      ].join('\n')
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
    const rules = [
      'allow|users:*Name(id:"aa",bool:false,num:50.5,arr:[1])',
      'deny|users:middleName',
      'deny|users:firstName:test',
      'allow|users(name:"John Doe"):firstName(arr:["aa"])',
      'allow|users(name:"blah"):foo',
      'allow|users(name:"Jane Siri")'
    ].join('\n');

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
        const rule = getDenialRule(rules, check.resource);
        expect(
          `${check.resource}->` +
            checkPermissions(rules, check.resource) +
            `->${rule && rule.toString()}`
        ).toEqual(
          `${check.resource}->` + check.result + `->${rule && rule.toString()}`
        );
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
          attributes: { name: 'Jane Siri' }
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
    const rules = [
      'allow|roles*:*',
      'allow|users:test:*',
      'deny|users:test:hello',
      'allow|car:brand'
    ].join('\n');

    it('checkPermissions', () => {
      const checks = [
        { resource: 'roles:blah', result: true },
        { resource: 'rolesXxaer:blah', result: true },
        { resource: 'users:test:aaa', result: true },
        { resource: 'car:brand', result: true },
        { resource: 'car:brand:aaa', result: false },
        { resource: 'users:test', result: true },
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
      `allow|jobs?(id:5,filter:{user:{id:"aaa"}}):*`,
      `allow|file*`,
      `allow|comment*`,
      `deny|job:blah`,
      `deny|job:foo`,
      `deny|job:detail`,
      `allow|*:User*:*`
    ].join('\n');

    it('check permissions', () => {
      const checks = [
        {
          resource: 'job',
          result: true,
          denialRule: null
        },
        {
          resource: 'jobs',
          result: true,
          denialRule: null
        },
        {
          resource: 'jobs:count',
          result: true,
          denialRule: null
        },
        {
          resource: 'job:count',
          result: true,
          denialRule: null
        },
        {
          resource: 'jobsblah:items',
          result: false,
          denialRule: null
        },
        {
          resource: 'job:blah',
          result: false,
          denialRule: 'deny|job:blah'
        },
        {
          resource: 'Query:job',
          result: false,
          denialRule: null
        },
        { resource: 'files', result: true, denialRule: null },
        {
          resource: 'job:detail',
          result: false,
          denialRule: `deny|job:detail`
        },
        { resource: 'deleteUser', result: false, denialRule: null }
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
