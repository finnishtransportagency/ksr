import React from 'react';
import { shallow } from 'enzyme';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalSaveEditedData from '../ModalSaveEditedData';

const setup = (prop) => {
    const minProps = {
        originalLayers: [],
        editedLayers: [],
    };

    const props = prop || minProps;
    const wrapper = shallow(<ModalSaveEditedData {...props} />);

    return { props, wrapper };
};

describe('<ModalSaveEditedData />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('contains <ModalContainer />', () => {
        expect(wrapper.find(ModalContainer).length).toBe(1);
    });
});
