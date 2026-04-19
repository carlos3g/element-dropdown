/**
 * Patch native measurement methods on mocked RN host components so components
 * that rely on `measureInWindow` for Modal positioning (e.g. Dropdown) can
 * actually open in tests. The RN jest preset mocks these as bare jest.fn()s
 * that never invoke their callback.
 */
const RN = require('react-native');

const fakeMeasureInWindow = (cb) => cb(0, 0, 200, 48);
const fakeMeasure = (cb) => cb(0, 0, 200, 48, 0, 0);

for (const name of ['View', 'ScrollView', 'Text', 'TextInput', 'Image']) {
  const Component = RN[name];
  if (Component?.prototype) {
    Component.prototype.measureInWindow = fakeMeasureInWindow;
    Component.prototype.measure = fakeMeasure;
  }
}
