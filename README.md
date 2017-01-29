ng Augment Native scroll
========================
_This is a angular (v1.x) directive port of the original experiments with [augment native scroll](https://github.com/iamvijaydev/augment-native-scroll)_

This module provides few directives to augment native scroll.

`connectScrolls` will connect scrolls within `scrollArea` so that they scroll synchronously. Meaning if one scrolls other will too. For non-touch devices it can also apply kinetic scroll. Here's an [example]().

`kineticScroll` will apply touch-device-like smooth and kinetic scroll to native scroll. You can (mouse) click-hold to drag the scroll and release-flick to auto-scroll just like a kinetic scroll on touch devices. Here's an [example]().

**NOTE: Kinetic scroll with mouse events will be applied to non-touch devices only. It will NOT be applied on touch devices.**

## connectScroll > scrollArea: Usage
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

## kineticScroll: Usage
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

## Configurable options
Option | Description | Default
--- | --- | ---
`enableKinetics` | **On touch devices kinetics won't be applied.** Apply touch-device-like smooth and kinetic scroll to native scroll. You can (mouse) click-hold to drag the scroll and release-flick to auto-scroll just like a kinetic scroll on touch devices. | `true`
`movingAverage` | The [moving average filter](https://en.wikipedia.org/wiki/Moving_average) protects the kinetic scroll going to a frenzy state. A lower value will have a slow and smooth kinetic scroll | `0.1`


## Exposed methods to $parent
Both directive `connectScrolls` and `kineticScroll` will expose couple of methods to it's parent scope. With the exposed methods we can move the scroll from parent scope, let's say to start or end. The exposed methods will be available on the namespace `augNs`. Here are the list of exposed methods:

Name | Description
--- | ---
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
