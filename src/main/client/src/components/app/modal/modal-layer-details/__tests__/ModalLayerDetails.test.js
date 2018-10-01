import React from 'react';
import { shallow } from 'enzyme';
import ModalLayerDetails from '../ModalLayerDetails';
import ModalLayerDetailsView from '../ModalLayerDetailsView';

const setup = () => {
    const props = {
        fields: [
            { name: 'Field1' },
            { name: 'Field2' },
            { name: 'Field3' },
        ],
        layer: {
            graphics: {
                items: [{
                    geometry: {
                        x: 123,
                        y: 123,
                        type: 'point',
                    },
                }],
            },
        },
        setTempGraphicsLayer: jest.fn(),
    };
    const wrapper = shallow(<ModalLayerDetails {...props} />);

    return { wrapper };
};

describe('<ModalLayerDetails />', () => {
    const { wrapper } = setup();

    it('should render <ModalLayerDetailsView/> ', () => {
        expect(wrapper.find(ModalLayerDetailsView).exists()).toBe(true);
    });

    it('should handle loadFields', () => {
        const expectedResult = {
            attributes: {
                Field1: '',
                Field2: '',
                Field3: '',
            },
            geometry: {
                x: 123,
                y: 123,
                type: 'point',
            },
        };

        wrapper.instance().loadFields();
        expect(wrapper.state('data')).toEqual(expectedResult);
    });

    it('should handle handleOnChange', () => {
        const expectedResult = {
            attributes: {
                Field1: 'Test Value',
                Field2: '',
                Field3: '',
            },
            geometry: {
                x: 123,
                y: 123,
                type: 'point',
            },
        };

        const evt = {
            target: {
                name: 'Field1',
                value: 'Test Value',
            },
        };

        wrapper.instance().handleOnChange(evt);

        expect(wrapper.state('data')).toEqual(expectedResult);
    });
});
