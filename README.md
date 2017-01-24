# ng Augment Native Scroll
This is a angular (1.x) directive port of the original experiments with [augmenting native scroll](https://github.com/iamvijaydev/augment-native-scroll)

## Download
I know its not npm or bower ready yet, but you can use it now [main diective file](https://raw.githubusercontent.com/iamvijaydev/ng-augment-native-scroll/master/src/ngAugmentNativeScroll.js) now. Packages are coming soon.

## Usage
* After downloading, include the `ngAugmentNativeScroll.js` script into your app.
* Add the module as a dependency to your app: `angular.module('app', ['ngAugmentNativeScroll'])`
* Example directive usage:
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
* Wrap the scroll(s) that you want to connect or have scroll synchronously with `connect-scrolls` directive. It also accepts a option object (more below)
* Wrap each scroll with `scroll-area` directive

## connect-scrolls options
| Option  | 	Description | 	Default  |
|------------|----------------|-----|
| `enableKinetics`| This can only be enabled for non-touch devices. The ability to emulate tap and flick to enter kinetic scrolling. On desktop this can be done by click-hold to drag the scroll area and flick-release to enter kinetic scrolling. Since kinetic/smooth scrolling is available in most devices this is disabled by default. | `false` |
| `movingAverage`| The [moving average filter](https://en.wikipedia.org/wiki/Moving_average) protects the kinetic scroll going to a frenzy state. A lower value will have a slow and smooth kinetic scroll | `0.1` |


## connect-scrolls exposed methods
connectScrolls exposed couple of methods to its parent scope with the namespace `connectedScrolls` which can be accessed as `$scope.connectedScrolls`. Since the directive is initialized after the parent scope, its better not expect `$scope.connectedScrolls` as soon as you parent scope is ready. If you have to, you can use it after a delay, [example](https://github.com/iamvijaydev/ng-augment-native-scroll/blob/master/examples/scripts/app.js#L43-L46). Here are the list of exposed methods:
| Name  | 	Description |
|------------|----------------|
| `scrollToStart`| Scrolls all scroll to start, i:e scrollLeft and scrollTop are set to `0` |
| `scrollToStartLeft`| Scrolls all scrollLeft to start |
| `scrollToStartTop`| Scrolls all scrollTop to start |
| `scrollToEnd`| Scrolls all scroll to end or max scroll, i:e scrollLeft and scrollTop are set to possible max scroll value |
| `scrollToEndLeft`| Scrolls all scrollLeft to end or max scroll left value |
| `scrollToEndTop`| Scrolls all scrollTop to end or max scroll top value |
