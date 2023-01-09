import React from 'react';
import { shallow } from 'enzyme';
import ModalDownloadCsv from '../ModalDownloadCsv';


const setup = () => {
    const minProps = {
        layerFeatures: {
        },
    };

    const wrapper = shallow(<ModalDownloadCsv {...minProps} />);

    return { wrapper, minProps };
};

describe.skip('<ModalDownloadCsv />', () => {
    const { wrapper } = setup();

    it('should render', () => {
        expect(wrapper.exists()).toBe(true);
    });
});
