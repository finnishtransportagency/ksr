import React from 'react';
import { shallow } from 'enzyme';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalAddUserLayer from '../ModalAddUserLayer';
import ModalAddUserLayerView from '../ModalAddUserLayerView';

const layerValues = {
    name: '',
    type: '',
    url: '',
    layers: '',
    opacity: 1,
    minScale: 577790,
    maxScale: 9027,
    transparent: true,
    attribution: '',
    desktopVisible: true,
    mobileVisible: true,
    styles: '',
    queryable: '0',
    queryColumns: '',
};

const setup = (prop) => {
    const minProps = {
        /* ... */
    };

    const props = prop || minProps;
    const wrapper = shallow(<ModalAddUserLayer {...props} />);

    return { props, wrapper };
};

describe.skip('<ModalAddUserLayer />', () => {
    it('should render Modal', () => {
        const { wrapper } = setup();
        expect(wrapper.find(ModalContainer).exists()).toBe(true);
        expect(wrapper.find(ModalAddUserLayerView).exists()).toBe(true);
    });

    it('should handle handleInputChange correctly', () => {
        const { wrapper } = setup();
        wrapper.setState({ layerValues });
        expect(wrapper.state('layerValues')).toEqual(layerValues);

        let evt = {
            target: {
                name: 'name',
                value: 'Taustakartta',
            },
        };
        wrapper.instance().handleInputChange(evt);

        evt = {
            target: {
                name: 'url',
                value: 'test.url.com',
            },
        };
        wrapper.instance().handleInputChange(evt);

        evt = {
            target: {
                name: 'attribution',
                value: 'MML',
            },
        };
        wrapper.instance().handleInputChange(evt);

        evt = {
            target: {
                name: 'layers',
                value: 'taustakartta_piste,taustakartta_alue',
            },
        };
        wrapper.instance().handleInputChange(evt);

        evt = {
            target: {
                name: 'minScale',
                value: 470000,
            },
        };
        wrapper.instance().handleInputChange(evt);

        evt = {
            target: {
                name: 'maxScale',
                value: 7000,
            },
        };
        wrapper.instance().handleInputChange(evt);

        evt = {
            target: {
                name: 'styles',
                value: 'highlight',
            },
        };
        wrapper.instance().handleInputChange(evt);

        evt = {
            target: {
                name: 'queryColumns',
                value: 'test, column',
            },
        };
        wrapper.instance().handleInputChange(evt);


        const expectedLayerValues = {
            name: 'Taustakartta',
            type: '',
            url: 'test.url.com',
            layers: 'taustakartta_piste,taustakartta_alue',
            opacity: 1,
            minScale: 470000,
            maxScale: 7000,
            transparent: true,
            attribution: 'MML',
            desktopVisible: true,
            mobileVisible: true,
            styles: 'highlight',
            queryable: '0',
            queryColumns: 'test, column',
        };

        expect(wrapper.state('layerValues')).toEqual(expectedLayerValues);
    });

    it('should handle handleTypeChange correctly', () => {
        const { wrapper } = setup();
        wrapper.setState({ layerValues });
        expect(wrapper.state('layerValues')).toEqual(layerValues);

        const type = 'agfs';
        wrapper.instance().handleTypeChange(type);

        const expectedLayerValues = {
            name: '',
            type: 'agfs',
            url: '',
            layers: '',
            opacity: 1,
            minScale: 577790,
            maxScale: 9027,
            transparent: true,
            attribution: '',
            desktopVisible: true,
            mobileVisible: true,
            styles: '',
            queryable: '0',
            queryColumns: '',
        };

        expect(wrapper.state('layerValues')).toEqual(expectedLayerValues);
    });

    it('should handle handleCheckboxChange correctly', () => {
        const { wrapper } = setup();
        wrapper.setState({ layerValues });
        expect(wrapper.state('layerValues')).toEqual(layerValues);

        wrapper.instance().handleCheckboxChange('transparent');
        wrapper.instance().handleCheckboxChange('desktopVisible');
        wrapper.instance().handleCheckboxChange('mobileVisible');

        const expectedLayerValues = {
            name: '',
            type: '',
            url: '',
            layers: '',
            opacity: 1,
            minScale: 577790,
            maxScale: 9027,
            transparent: false,
            attribution: '',
            desktopVisible: false,
            mobileVisible: false,
            styles: '',
            queryable: '0',
            queryColumns: '',
        };

        expect(wrapper.state('layerValues')).toEqual(expectedLayerValues);
    });

    it('should handle handleOpacityChange correctly', () => {
        const { wrapper } = setup();
        wrapper.setState({ layerValues });
        expect(wrapper.state('layerValues')).toEqual(layerValues);

        wrapper.instance().handleOpacityChange(0.6);

        const expectedLayerValues = {
            name: '',
            type: '',
            url: '',
            layers: '',
            opacity: 0.6,
            minScale: 577790,
            maxScale: 9027,
            transparent: true,
            attribution: '',
            desktopVisible: true,
            mobileVisible: true,
            styles: '',
            queryable: '0',
            queryColumns: '',
        };

        expect(wrapper.state('layerValues')).toEqual(expectedLayerValues);
    });
});
