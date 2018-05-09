import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// require all the test files in the components that ends with spec.js
const testsContext = require.context('../src/components', true, /test.js/);
testsContext.keys().forEach(testsContext);

// output at when the test were run
console.info(`TESTS RAN AT ${new Date().toLocaleTimeString()}`);
