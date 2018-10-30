import React from 'react';
import { shallow } from 'enzyme';
import strings from '../../../../../translations';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ContractListView from '../modal-feature-contracts-views/ContractListView';
import ModalFeatureContracts from '../ModalFeatureContracts';

const setup = () => {
    const wrapper = shallow(<ModalFeatureContracts />);
    return { wrapper };
};

describe('<ModalFeatureContracts />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find(ModalContainer).exists()).toBe(true);
        expect(wrapper.find(ContractListView).exists()).toBe(true);
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
        expect(wrapper.state('title')).toBe(strings.modalFeatureContracts.titleListView);
    });
});
