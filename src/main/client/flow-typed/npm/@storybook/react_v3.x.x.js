// flow-typed signature: 1bf95e2d2cf5509cc55137365a8a7c8e
// flow-typed version: 9d326d4ede/@storybook/react_v3.x.x/flow_>=v0.104.x

type NodeModule = typeof module;

declare module '@storybook/react' {
  declare type Context = {
    kind: string,
    story: string,
    ...
  };
  declare type Renderable = React$Element<any>;
  declare type RenderCallback = (
    context: Context
  ) => Renderable | Array<Renderable>;
  declare type RenderFunction = () => Renderable | Array<Renderable>;

  declare type StoryDecorator = (
    story: RenderFunction,
    context: Context
  ) => Renderable | null;

  declare interface Story {
    +kind: string;
    add(storyName: string, callback: RenderCallback): Story;
    addDecorator(decorator: StoryDecorator): Story;
  }

  declare interface StoryObject {
    name: string;
    render: RenderFunction;
  }

  declare interface StoryBucket {
    kind: string;
    filename: string;
    stories: Array<StoryObject>;
  }

  declare function addDecorator(decorator: StoryDecorator): void;
  declare function configure(fn: () => void, module: NodeModule): void;
  declare function setAddon(addon: Object): void;
  declare function storiesOf(name: string, module: NodeModule): Story;
  declare function storiesOf<T>(name: string, module: NodeModule): Story & T;
  declare function forceReRender(): void;

  declare function getStorybook(): Array<StoryBucket>;
}
