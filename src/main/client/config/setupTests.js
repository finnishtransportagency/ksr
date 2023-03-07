import 'jest-styled-components';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.crypto = require('@trust/webcrypto');

global.ResizeObserver = require('resize-observer-polyfill');
global.fetch = require('jest-fetch-mock');

configure({ adapter: new Adapter() });
