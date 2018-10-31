import React from 'react';
import { shallow } from 'enzyme';
import strings from '../../../../../translations';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ContractListContainer from '../contract-list/ContractListContainer';
import ModalFeatureContracts from '../ModalFeatureContracts';

const setup = (prop) => {
    const minProps = {
        removeContractListInfo: jest.fn(),
    };
    const props = prop || minProps;
    const wrapper = shallow(<ModalFeatureContracts {...props} />);
    return { wrapper };
};

describe('<ModalFeatureContracts />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find(ModalContainer).exists()).toBe(true);
        expect(wrapper.find(ContractListContainer).exists()).toBe(true);
    });

    it('handleSubmitLinkToContract - should set correct state', () => {
        const instance = wrapper.instance();
        instance.handleSubmitLinkToContract();
        expect(wrapper.state('activeView')).toBe('linkContract');
        expect(wrapper.state('title')).toBe(strings.modalFeatureContracts.titleLinkContract);
    });

    it('handleGoBack - should set correct state', () => {
        const instance = wrapper.instance();
        instance.handleGoBack();
        expect(wrapper.state('activeView')).toBe('contractList');
        expect(wrapper.state('title')).toBe(strings.modalFeatureContracts.listView.title);
    });

    it('handleModalCancel - should call redux action to remove contract list info', () => {
        const instance = wrapper.instance();
        const { removeContractListInfo } = wrapper.instance().props;
        instance.handleModalCancel();
        expect(removeContractListInfo).toHaveBeenCalled();
    });
});
