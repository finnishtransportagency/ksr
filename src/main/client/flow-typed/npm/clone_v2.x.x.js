// flow-typed signature: 6064f75a78eae6146d8c8df42d663827
// flow-typed version: da30fe6876/clone_v2.x.x/flow_>=v0.25.x

// @flow

declare module 'clone' {
  declare module.exports: <T>(val: any, circular: boolean, depth: number) => T;
}
