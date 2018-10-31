# acl

[![Build Status](https://travis-ci.org/graphql-services/acl.svg?branch=master)](https://travis-ci.org/graphql-services/acl)

Library for handling Access Control List permissions

## Install

```
yarn add @graphql/acl
// or
npm i --save @graphql/acl
```

## Example usage

```
import { PermissionList } from '@graphql/acl'

const acl = new PermissionList(
    'allow|users:*name\n' + 'deny|users:password\n' + 'allow|tasks:*'
);

acl.isAllowed('users:username') // => true
acl.isAllowed('users:name') // => true
acl.isAllowed('users:password') // => false
acl.isAllowed('tasks:anything') // => true
```
