import React from 'react';
import { shallow } from 'enzyme';
import * as fetchMock from '../../../../../../api/contract/contractRelations';
import LoadingIcon from '../../../../shared/LoadingIcon';
import EditContract from '../EditContract';
import ModalLayerDetailsView from '../../../modal-layer-details/ModalLayerDetailsView';

const setup = (prop) => {
    fetchMock.fetchContractRelation = jest.fn(() => Promise.resolve({ features: null }));

    const minProps = {
        contractLinkValidation: jest.fn(),
        fields: [],
        setData: jest.fn(),
        objectId: 123,
        currentLayer: {
            id: 1,
        },
    };
    const props = prop || minProps;
    const wrapper = shallow(<EditContract {...props} />);
    return { wrapper };
};

describe('<EditContract />', () => {
    const { wrapper } = setup();

    it('render - should render edit contract list view', () => {
        wrapper.setState({ fetching: false });
        expect(wrapper.find(LoadingIcon).exists()).toBe(false);
        expect(wrapper.find(ModalLayerDetailsView).exists()).toBe(true);
    });
});

