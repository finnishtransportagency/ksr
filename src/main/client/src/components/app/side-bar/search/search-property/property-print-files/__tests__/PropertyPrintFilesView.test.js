import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '../../../../../shared/LoadingIcon';
import { PropertyFeature } from '../../styles';
import PropertyPrintFilesView from '../PropertyPrintFilesView';

const setup = (prop) => {
    const minProps = {
        links: {
            registerunit: [],
            deed: [],
            easement: [],
            map: [],
        },
        fetching: false,
    };

    const props = prop || minProps;
    const wrapper = shallow(<PropertyPrintFilesView {...props} />);

    return { wrapper };
};

describe('<PropertyInfoView />', () => {
    it('render - should render LoadingIcon', () => {
        const props = {
            links: null,
            fetching: true,
        };
        const { wrapper } = setup(props);

        expect(wrapper.find(LoadingIcon)).toHaveLength(1);
    });

    it('render - should render property links', () => {
        const props = {
            links: {
                registerunit: ['http://test.url'],
                deed: ['http://test.url'],
                easement: ['http://test.url'],
                map: ['http://test.url'],
            },
            fetching: false,
        };
        const { wrapper } = setup(props);

        expect(wrapper.find(PropertyFeature)).toHaveLength(4);
    });
});
