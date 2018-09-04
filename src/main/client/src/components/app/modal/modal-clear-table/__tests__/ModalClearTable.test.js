import React from 'react';
import { shallow } from 'enzyme';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalClearTable from '../ModalClearTable';

const setup = (prop) => {
    const minProps = {
        clearTableData: () => {},
    };

    const props = prop || minProps;
    const wrapper = shallow(<ModalClearTable {...props} />);

    return { props, wrapper };
};

describe('<ModalClearTable />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('contains <ModalContainer />', () => {
        expect(wrapper.find(ModalContainer).length).toBe(1);
    });
});
