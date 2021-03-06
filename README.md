# acl

[![Build Status](https://travis-ci.org/graphql-services/acl.svg?branch=master)](https://travis-ci.org/graphql-services/acl)

Library for handling Access Control List permissions

## Install

```
yarn add acl-permissions
// or
npm i --save acl-permissions
```

## Example usage

```
import { PermissionList } from 'acl-permissions'

const acl = new PermissionList(
    'allow|users(blah:"foo"):*name(hello:"world",id:123)\n' + 'deny|users:password\n' + 'allow|tasks:*'
);

acl.isAllowed('users:username') // => true
acl.isAllowed('users:name') // => true
acl.isAllowed('users:password') // => false
acl.isAllowed('tasks:anything') // => true

acl.getAttributes('users') // => {blah: 'foo'}
acl.getAttributes('users:first_name') // => {hello:"world",id:123}
```
