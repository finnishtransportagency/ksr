import React from 'react';
import { shallow } from 'enzyme';
import * as fetchMock from '../../../../../../api/contract/contractRelations';
import LoadingIcon from '../../../../shared/LoadingIcon';
import AddContract from '../AddContract';
import ModalLayerDetailsView from '../../../modal-layer-details/ModalLayerDetailsView';

const setup = (prop) => {
    fetchMock.fetchContractRelation = jest.fn(() => Promise.resolve({ features: null }));

    const minProps = {
        contractLinkValidation: jest.fn(),
        currentLayer: {},
        contractLayer: {},
        fields: [],
        setData: jest.fn(),
    };
    const props = prop || minProps;
    const wrapper = shallow(<AddContract {...props} />);
    return { wrapper };
};

describe('<AddContract />', () => {
    const { wrapper } = setup();

    it('render - should render add contract list view', () => {
        wrapper.setState({ fetching: false });
        expect(wrapper.find(LoadingIcon).exists()).toBe(false);
        expect(wrapper.find(ModalLayerDetailsView).exists()).toBe(true);
    });
});

