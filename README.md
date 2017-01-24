# ng Augment Native Scroll
This is a angular (1.x) directive port of the original experiments with augmenting native scroll [here](https://github.com/iamvijaydev/augment-native-scroll)

## Download
I know its not npm or bower ready yet, but you can download the [main diective file](https://raw.githubusercontent.com/iamvijaydev/ng-augment-native-scroll/master/src/ngAugmentNativeScroll.js). As packages coming soon.

## Usage
* After downloading, include the `ngAugmentNativeScroll.js` script into your app.
* Add `'ngAugmentNativeScroll'` as a module dependency to your app: `angular.module('app', ['ngAugmentNativeScroll'])`
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
* Wrap the scroll(s) that you want to connect or have scroll synchronously with `connect-scrolls` directive
* Wrap each scroll with `scroll-area` directive

## `connect-scrolls` options
| Option  | 	Description | 	Default  |
|------------|----------------|-----|
| `enableKinetics`| This can only be enabled for non-touch devices only. The ability to emulate tap and flick to enter kinetic scrolling. On desktop this can be done by click-hold to drag the scroll area and flick-release to enter kinetic scrolling. Since kinetic/smooth scrolling is available in most devices this is disabled by default. | `false` |
| `movingAverage`| The [moving average filter](https://en.wikipedia.org/wiki/Moving_average) protects the kinetic scroll going to a frenzy state. A lower value will have a slow and smooth kinetic scroll | `0.1` |
