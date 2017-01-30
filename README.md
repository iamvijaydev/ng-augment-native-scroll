[![npm version](https://badge.fury.io/js/ng-augment-native-scroll.svg)](https://badge.fury.io/js/ng-augment-native-scroll) [![Bower version](https://badge.fury.io/bo/ng-augment-native-scroll.svg)](https://badge.fury.io/bo/ng-augment-native-scroll)

ng Augment Native scroll
========================
_This is a angular (v1.x) directive port of the original experiments with [augment native scroll](https://github.com/iamvijaydev/augment-native-scroll)_

This module provides few directives to augment native scroll.

* `connectScrolls` will connect scrolls within `scrollArea` so that they scroll synchronously. Meaning if one scrolls other will too. For non-touch devices it can also apply kinetic scroll. Here's an [example](https://iamvijaydev.github.io/ng-augment-native-scroll/examples/connectedScrolls.html).
* `kineticScroll` will apply touch-device-like smooth and kinetic scroll to native scroll. You can (mouse) click-hold to drag the scroll and release-flick to auto-scroll just like a kinetic scroll on touch devices. Here's an [example](https://iamvijaydev.github.io/ng-augment-native-scroll/examples/kineticScroll.html).

**NOTE: Kinetic scroll with mouse events will be applied to non-touch devices only. It will NOT be applied on touch devices.**


# Installation
Via npm:
```
$ npm install ng-augment-native-scroll --save
```
Via bower:
```
$ bower install ng-augment-native-scroll --save
```
Direct use: Download the files in [/dist](https://github.com/iamvijaydev/ng-augment-native-scroll/tree/master/dist)


# Include package
The module is wrapped with [UMD](https://webpack.github.io/docs/configuration.html#output-librarytarget) so can be used as commonjs require or as global. For require:
```javascript
var angular = require('angular');
angular.module('app', [require('ng-augment-native-scroll')]);
```
For global, make sure you have included `angular.js` and `ngAugmentNativeScroll.js`, before using it in your script as:
```javascript
angular.module('app', ['ng-augment-native-scroll']);
```


# connectScroll > scrollArea: Usage
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
`scrollArea` requires `connectScroll`. Similarly `connectScroll` expects `scrollArea` to define the scrollable areas to be connected. Neither can be used alone.


# kineticScroll: Usage
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
Option | Description | Default
--- | :--- | :---
`enableKinetics` | **On touch devices kinetics won't be applied.** Apply touch-device-like smooth and kinetic scroll to native scroll. You can (mouse) click-hold to drag the scroll and release-flick to auto-scroll just like a kinetic scroll on touch devices. | `true`
`movingAverage` | The [moving average filter](https://en.wikipedia.org/wiki/Moving_average) protects the kinetic scroll going to a frenzy state. A lower value will have a slow and smooth kinetic scroll | `0.1`


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
