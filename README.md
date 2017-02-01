[![npm version](https://badge.fury.io/js/ng-augment-native-scroll.svg)](https://badge.fury.io/js/ng-augment-native-scroll) [![Bower version](https://badge.fury.io/bo/ng-augment-native-scroll.svg)](https://badge.fury.io/bo/ng-augment-native-scroll)

[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/ng-augment-native-scroll)

ng Augment Native scroll
========================
_This is a angular (v1.x) directive port of the original experiments with [augment native scroll](https://github.com/iamvijaydev/augment-native-scroll)_

This module provides few directives to augment native scroll.

* `connectScrolls` will connect scrolls within `scrollArea` so that they scroll synchronously. Meaning if one scrolls other will too. For non-touch devices it can also apply kinetic scroll. Here's an [example](https://iamvijaydev.github.io/ng-augment-native-scroll/examples/connectedScrolls.html).
* `kineticScroll` will apply touch-device-like smooth and kinetic scroll to native scroll. You can (mouse) click-hold to drag the scroll and release-flick to auto-scroll just like a kinetic scroll on touch devices. Here's an [example](https://iamvijaydev.github.io/ng-augment-native-scroll/examples/kineticScroll.html).

**NOTE: Kinetic scroll with mouse events will be applied to non-touch devices only. It will NOT be applied on touch devices.**


# Installation and usage
###Via npm:
```
$ npm install ng-augment-native-scroll --save
```
Then use it as:
```javascript
// main.js
var angular = require('angular');
angular.module('mainApp', [
    require('ng-augment-native-scroll')
]);
```
###Via bower:
```
$ bower install ng-augment-native-scroll --save
```
This package make use of [commonjs](https://nodejs.org/docs/latest/api/modules.html) (require, exports), so you can use it as shown above for npm package. The main file can be integrated using [these tools](https://bower.io/docs/tools/).

###Direct use:
Download the files in [/dist](https://github.com/iamvijaydev/ng-augment-native-scroll/tree/master/dist). Include it in your HTML file and use it in your script file as shown below:
```html
<script src="path/to/file" charset="utf-8"></script>
```
```javascript
// main.js
angular.module('mainApp', ['ng-augment-native-scroll']);
```


# `connectScroll` and `scrollArea` directive usage
These directives can be used like the example below:
```html
<connect-scrolls options="options">
    <scroll-area>
        <ul id="list">
            <li ng-repeat="item in data.list">{{ item }}</li>
        </ul>
    </scroll-area>
    <scroll-area>
        <table id="table">
            <tbody>
                <tr ng-repeat="row in data.table track by $index">
                    <td ng-repeat="cell in row track by $index">{{ cell }}</td>
                </tr>
            </tbody>
        </table>
    </scroll-area>
</connect-scrolls>
```
`scrollArea` requires `connectScroll` and `connectScroll` expects `scrollArea` to define the scrollable areas to be connected. Neither can be used alone.


# `kineticScroll` directive usage
This directive can be used like the example below:
```html
<kinetic-scroll options="options">
    <table id="table">
        <tbody>
            <tr ng-repeat="row in data.table track by $index">
                <td ng-repeat="cell in row track by $index">{{ cell }}</td>
            </tr>
        </tbody>
    </table>
</kinetic-scroll>
```
`kineticScroll` expects its first child to be a scrollable area. It's better to wrap just the scrollable item with kineticScroll.


# Configurable options
Option | Description | Type | Default
--- | :--- | :--- | :---
`enableKinetics` | **On touch devices kinetics won't be applied.** Apply touch-device-like smooth and kinetic scroll to native scroll. You can (mouse) click-hold to drag the scroll and release-flick to auto-scroll just like a kinetic scroll on touch devices. | Boolean | `true`
`movingAverage` | The [moving average filter](https://en.wikipedia.org/wiki/Moving_average) protects the kinetic scroll going to a frenzy state. A lower value will have a slow and smooth kinetic scroll | Number | `0.1`
`preventDefaultException` | Mouse events for kinetic scrolling is prevented from executing default action, i:e`e.preventDefault()` is called internally. This can make elements non-responsive. For e.g: select wont open. You can provide `tagName`, `class` or `id` that when matched wont call `preventDefault`. By default input, textarea, button and select are exempted. | Object | [Look here](https://github.com/iamvijaydev/ng-augment-native-scroll/blob/master/src/augNsOptions.value.js#L6-L8)


# Exposed methods to $parent
Both directive `connectScrolls` and `kineticScroll` will expose couple of methods to it's parent scope. With the exposed methods we can move the scroll from parent scope, let's say to start or end. The exposed methods will be available on the namespace `augNs`. Here are the list of exposed methods:

Name | Description
--- | :---
`scrollToStart` | Scrolls all scroll to start, i:e scrollLeft and scrollTop are set to `0`
`scrollToStartLeft` | Scrolls all scrollLeft to start
`scrollToStartTop` | Scrolls all scrollTop to start
`scrollToEnd` | Scrolls all scroll to end or max scroll, i:e scrollLeft and scrollTop are set to possible max scroll value
`scrollToEndLeft` | Scrolls all scrollLeft to end or max scroll left value
`scrollToEndTop` | Scrolls all scrollTop to end or max scroll top value

Here is an example of how it can be used on the $parent scope:
```javascript
DataService.fetchUserList()
    .then(function (data) {
        $scope.userList = data;
        $scope.augNs.scrollToStart();
    })
```

# TODO
Testing and codecoverage.

#Future
* Implement pull-down-to functionality - refresh or load previous page to name a few
* Implement pull-up-to functionality - load next page may be
