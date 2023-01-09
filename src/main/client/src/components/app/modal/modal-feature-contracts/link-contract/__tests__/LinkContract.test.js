import React from 'react';
import { shallow } from 'enzyme';
import * as fetchMock from '../../../../../../api/contract/contractRelations';
import LoadingIcon from '../../../../shared/LoadingIcon';
import LinkContract from '../LinkContract';
import LinkContractView from '../LinkContractView';

const setup = (prop) => {
    fetchMock.fetchContractRelation = jest.fn(() => Promise.resolve({ features: null }));

    const minProps = {
        contractLinkValidation: jest.fn(),
        currentLayer: {},
        contractLayer: {},
    };
    const props = prop || minProps;
    const wrapper = shallow(<LinkContract {...props} />);
    return { wrapper };
};

describe.skip('<LinkContract />', () => {
    const { wrapper } = setup();

    it('render - should render contract list view', () => {
        wrapper.setState({ fetchingContracts: false });
        expect(wrapper.find(LoadingIcon).exists()).toBe(false);
        expect(wrapper.find(LinkContractView).exists()).toBe(true);
    });
});

