import 'jest-styled-components';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

global.fetch = require('jest-fetch-mock');

Enzyme.configure({ adapter: new Adapter() });
