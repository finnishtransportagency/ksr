import React from 'react';
import { mount } from 'enzyme';
import ModalContractDetailsView from '../ModalContractDetailsView';
import LoadingIcon from '../../../shared/LoadingIcon';
import strings from '../../../../../translations';
import Contract from '../../../../ui/blocks/Contract';

const minProps = {
    contractLayerId: '123',
    detailList: [],
    fetchingDetailList: true,
    editPermission: true,
    handleFeatureDetailsClick: jest.fn(),
    handleFeatureUnlinkClick: jest.fn(),
    handleFeatureEditClick: jest.fn(),
};

const setup = (prop) => {
    const props = prop || minProps;
    const wrapper = mount(<ModalContractDetailsView {...props} />);

    return { wrapper, minProps };
};

describe('<ModalContractDetailsView />', () => {
    it('render - should show loading while fetching', () => {
        const { wrapper } = setup();

        expect(wrapper.find(LoadingIcon).length).toBe(1);
    });

    it('render - should show error text if no details found', () => {
        const props = {
            ...minProps,
            detailList: [],
            handleFeatureDetailsClick: jest.fn(),
            fetchingDetailList: false,
        };

        const { wrapper } = setup(props);

        expect(wrapper.find('p').length).toBe(1);
        expect(wrapper.find(LoadingIcon).length).toBe(0);

        expect(wrapper.find('p').text()).toBe(strings.modalContractDetails.errorNoFeaturesFound);
    });

    it('render - should show details list', () => {
        const props = {
            ...minProps,
            detailList: [{
                id: '123',
                name: 'Layer 1',
                features: [
                    { id: '1', description: 'Description 1' },
                    { id: '10', description: 'Description 2' },
                ],
            }, {
                id: '789',
                name: 'Layer 3',
                features: [
                    { id: '123', description: 'Test Description' },
                ],
            }],
            handleFeatureDetailsClick: jest.fn(),
            fetchingDetailList: false,
        };

        const { wrapper } = setup(props);

        expect(wrapper.find('p').length).toBe(2);
        expect(wrapper.find('p').at(0).text()).toBe('Layer 1');
        expect(wrapper.find('p').at(1).text()).toBe('Layer 3');

        expect(wrapper.find(Contract).length).toBe(3);

        const { handleFeatureDetailsClick } = wrapper.props();

        wrapper.find(Contract).at(0).find(Contract.IconWrapper.Icon).at(0)
            .simulate('click');
        wrapper.find(Contract).at(1).find(Contract.IconWrapper.Icon).at(0)
            .simulate('click');
        wrapper.find(Contract).at(2).find(Contract.IconWrapper.Icon).at(0)
            .simulate('click');
        expect(handleFeatureDetailsClick).toHaveBeenCalledTimes(3);
    });

    it('render - should show correct amount of icons with editPermission', () => {
        const props = {
            ...minProps,
            editPermission: true,
            contractLayerId: '123',
            fetchingDetailList: false,
            detailList: [{
                id: '123',
                name: 'Layer 1',
                features: [
                    { id: '1', description: 'Description 1' },
                ],
            }, {
                id: '789',
                name: 'Layer 3',
                features: [
                    { id: '123', description: 'Test Description 1' },
                    { id: '456', description: 'Test Description 2' },
                    { id: '789', description: 'Test Description 3' },
                ],
            }],
        };

        const { wrapper } = setup(props);

        expect(wrapper.find(Contract.IconWrapper.Icon).length).toBe(13);

        const { handleFeatureEditClick, handleFeatureUnlinkClick } = wrapper.props();

        wrapper.find(Contract).at(0).find(Contract.IconWrapper.Icon).at(1)
            .simulate('click');
        wrapper.find(Contract).at(1).find(Contract.IconWrapper.Icon).at(1)
            .simulate('click');
        wrapper.find(Contract).at(2).find(Contract.IconWrapper.Icon).at(1)
            .simulate('click');
        wrapper.find(Contract).at(3).find(Contract.IconWrapper.Icon).at(1)
            .simulate('click');
        expect(handleFeatureEditClick).toHaveBeenCalledTimes(4);

        wrapper.find(Contract).at(0).find(Contract.IconWrapper.Icon).at(2)
            .simulate('click');
        wrapper.find(Contract).at(1).find(Contract.IconWrapper.Icon).at(2)
            .simulate('click');
        wrapper.find(Contract).at(2).find(Contract.IconWrapper.Icon).at(2)
            .simulate('click');
        wrapper.find(Contract).at(3).find(Contract.IconWrapper.Icon).at(2)
            .simulate('click');
        expect(handleFeatureUnlinkClick).toHaveBeenCalledTimes(3);
    });

    it('render - should show correct amount of icons without editPermission', () => {
        const props = {
            ...minProps,
            editPermission: false,
            contractLayerId: '123',
            fetchingDetailList: false,
            detailList: [{
                id: '123',
                name: 'Layer 1',
                features: [
                    { id: '1', description: 'Description 1' },
                ],
            }, {
                id: '789',
                name: 'Layer 3',
                features: [
                    { id: '123', description: 'Test Description 1' },
                    { id: '456', description: 'Test Description 2' },
                    { id: '789', description: 'Test Description 3' },
                ],
            }],
        };

        const { wrapper } = setup(props);

        expect(wrapper.find(Contract.IconWrapper.Icon).length).toBe(6);
    });
});
