import React from 'react';
import { shallow } from 'enzyme';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalExtractSelected from '../ModalExtractSelected';
import ModalExtractSelectedView from '../ModalExtractSelectedView';

const setup = (prop) => {
    const minProps = {
        layerId: '',
        selectedGeometryData: [{}],
        extractServiceUrl: '',
    };

    const props = prop || minProps;
    const wrapper = shallow(<ModalExtractSelected {...props} />);

    return { props, wrapper };
};

describe('<ModalExtractSelected />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('contains <ModalContainer />', () => {
        expect(wrapper.find(ModalContainer).length).toBe(1);
    });
    it('contains <ModalExtractSelectedView />', () => {
        expect(wrapper.find(ModalExtractSelectedView).length).toBe(1);
    });
});
