[![NPM](https://nodei.co/npm/ng-disable-scroll-nocss.png?downloads=true)](https://nodei.co/npm/ng-disable-scroll-nocss/)

### What does it do

Sometimes when a certain action happens, for instance, main menu slides out,
it is often desirable to prevent the main body from scrolling and only allow the menu to be scrollable.

This is fairly easy to do on desktop browsers, all that is needed is to set root container to be "overflow: hidden";
but things are not so easy on mobile, and can be very tricky.

This is where ng-disable-scroll-nocss directive comes in.

### Install

```
  npm install --save ng-disable-scroll-nocss
```

```
  bower install --save ng-disable-scroll-nocss
```

### How do I use it

It is very simple to use it.

1. make your Angular app depends on ngDisableScrollNocss module

  ```javascript
    angular.module("app", [
      "ngDisableScrollNocss"
    ]);
  ```

  or with Browserify or Webpack

  ```javascript
    angular.module("app", [
      require("ng-disable-scroll-nocss").name
    ]);
  ```

2. add 'ng-disable-scroll-nocss' to one of the element, and specify an expression which will be evaluated to be truthy when scrolling should be prevented.

  For example when menu is open
  ```html
    <div ng-disable-scroll="menu.open">
    ...
    </div>
  ```

3. optionally, can also specify which child element(s) are scrollable by providing an CSS selector; by default, the element where this directive is used will be used this is not specified.

  One example use case is when there is a multi-level menu, only the second level menus are allowed to scroll
  ```html
    <div ng-disable-scroll="menu.open" scrollable-elements=".second-level-menu">
    ...
    </div>
  ```
