import React from 'react';
import { shallow } from 'enzyme';
import ModalShapefile from '../ModalShapefile';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalShapefileView from '../ModalShapefileView';
import {
    shape2geoJson,
    convertLayerListFormat,
} from '../../../../../utils/shape2geojson';

jest.mock('../../../../../utils/shape2geojson');

const setup = (prop) => {
    const minProps = {
        view: {
            map: {
                add: jest.fn(),
            },
        },
        setActiveModal: jest.fn(),
        layerList: [],
        addShapefile: jest.fn(),
    };

    const props = prop || minProps;
    const wrapper = shallow(<ModalShapefile {...props} />);

    return { props, wrapper };
};

describe('<ModalShapefile />', () => {
    beforeAll(() => {
        shape2geoJson.mockResolvedValue({ id: 1, title: 'test' });
        convertLayerListFormat.mockReturnValue({ id: 2, title: 'test2' });
    });

    it('should render itself', () => {
        const { wrapper } = setup();
        expect(wrapper.find(ModalContainer).exists()).toBe(true);
        expect(wrapper.find(ModalShapefileView).exists()).toBe(true);
    });

    it('should have initially submit disabled', () => {
        const { wrapper } = setup();
        const modalContainer = wrapper.find(ModalContainer).first();
        const modalSubmit = modalContainer.prop('modalSubmit');
        const submitButton = modalSubmit[0];
        expect(submitButton.disabled).toBeTruthy();
    });

    it('should have submit disabled if color selected but no files', () => {
        const { wrapper } = setup();
        wrapper.instance().setColor('#fff');
        const modalContainer = wrapper.find(ModalContainer).first();
        const modalSubmit = modalContainer.prop('modalSubmit');
        const submitButton = modalSubmit[0];
        expect(submitButton.disabled).toBeTruthy();
    });

    it('should have submit disabled if files selected but no color', () => {
        const { wrapper } = setup();
        wrapper.instance().onDrop([
            { name: 'a.shp' },
            { name: 'a.dbf' },
        ]);
        const modalContainer = wrapper.find(ModalContainer).first();
        const modalSubmit = modalContainer.prop('modalSubmit');
        const submitButton = modalSubmit[0];
        expect(submitButton.disabled).toBeTruthy();
    });

    it('should have submit enabled if files selected and has color', () => {
        const { wrapper } = setup();
        wrapper.instance().setColor('#fff');
        wrapper.instance().onDrop([
            { name: 'a.shp' },
            { name: 'a.dbf' },
        ]);
        const modalContainer = wrapper.find(ModalContainer).first();
        const modalSubmit = modalContainer.prop('modalSubmit');
        const submitButton = modalSubmit[0];
        expect(submitButton.disabled).toBeFalsy();
    });

    it('should update color, if color selected', () => {
        const { wrapper } = setup();
        wrapper.instance().setColor('#ec4067');
        const modalShapefileView = wrapper.find(ModalShapefileView).first();
        expect(modalShapefileView.prop('color')).toBe('#ec4067');
    });

    it('should update selectedfiles, if files selected', () => {
        const { wrapper } = setup();
        wrapper.instance().onDrop([
            { name: 'a.shp' },
            { name: 'a.dbf' },
        ]);
        const modalShapefileView = wrapper.find(ModalShapefileView).first();
        expect(modalShapefileView.prop('acceptedFiles')).toMatchObject([
            { name: 'a.shp' },
            { name: 'a.dbf' },
        ]);
    });

    it('correctly adds shapefile to map and calls addShapefile', async () => {
        const { wrapper, props } = setup();

        const shp = new File([new ArrayBuffer(8)], 'a.shp');
        const dbf = new File([new ArrayBuffer(8)], 'a.dbf');
        wrapper.instance().onDrop([shp, dbf]);
        wrapper.instance().setColor('#fff');
        await wrapper.instance().onSubmit();

        expect(props.addShapefile.mock.calls[0][0]).toMatchObject({ id: 2, title: 'test2' });
        expect(props.view.map.add.mock.calls[0][0]).toMatchObject({ id: 1, title: 'test' });
    });
});
