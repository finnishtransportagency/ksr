import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import App from '../App';

describe('<App />', () => {
    const wrapper = shallow(<App />);

    it('renders <App />', () => {
        expect(wrapper.exists()).to.be.true;
    });
});
