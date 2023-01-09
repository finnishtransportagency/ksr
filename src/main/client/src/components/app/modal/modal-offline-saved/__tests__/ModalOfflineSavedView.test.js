import React from 'react';
import { shallow } from 'enzyme';
import ModalOfflineSavedView from '../ModalOfflineSavedView';

describe.skip('<ModalOfflineSavedView />', () => {
    it('should render', () => {
        const wrapper = shallow(<ModalOfflineSavedView />);
        expect(wrapper.exists()).toBe(true);
    });
});
