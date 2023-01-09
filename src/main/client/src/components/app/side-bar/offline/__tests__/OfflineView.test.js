import React from 'react';
import { shallow } from 'enzyme';

import SideBar from '../../../../ui/blocks/SideBar';
import OfflineView from '../OfflineView';
import EditsContainer from '../edits/EditsContainer';

describe.skip('<OfflineView />', () => {
    const setup = () => {
        const wrapper = shallow(<OfflineView />);
        return { wrapper };
    };

    it('should render', () => {
        const { wrapper } = setup();
        expect(wrapper.exists()).toBe(true);
    });

    it('contains a <SideBar.Header />', () => {
        const { wrapper } = setup();
        expect(wrapper.find(SideBar.Header).length).toBe(1);
    });

    it('contains a <SideBar.Content />', () => {
        const { wrapper } = setup();
        expect(wrapper.find(SideBar.Content).length).toBe(1);
    });

    it('contains an <EditsContainer />', () => {
        const { wrapper } = setup();
        expect(wrapper.find(EditsContainer).length).toBe(1);
    });
});
