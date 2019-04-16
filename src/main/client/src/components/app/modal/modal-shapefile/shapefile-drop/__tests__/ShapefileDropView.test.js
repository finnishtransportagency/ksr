import React from 'react';
import { shallow, mount } from 'enzyme';
import Dropzone from 'react-dropzone';
import ShapefileDropView from '../ShapefileDropView';
import { H2, Button } from '../../../../../ui/elements';
import strings from '../../../../../../translations';
import { DropzoneContent } from '../styles';

describe('<ShapefileDropView />', () => {
    it('should render itself', () => {
        const props = {
            onDrop: jest.fn(),
            acceptedFiles: [],
        };
        const wrapper = shallow(<ShapefileDropView {...props} />);
        expect(wrapper.exists()).toBeTruthy();
    });

    it('should contain title', () => {
        const props = {
            onDrop: jest.fn(),
            acceptedFiles: [],
        };
        const wrapper = shallow(<ShapefileDropView {...props} />);
        const title = wrapper.find(H2);
        expect(title.text()).toBe(strings.shapefileDropView.title);
    });

    it('should contain a Dropzone', () => {
        const props = {
            onDrop: jest.fn(),
            acceptedFiles: [],
        };
        const wrapper = shallow(<ShapefileDropView {...props} />);
        expect(wrapper.find(Dropzone).length).toBe(1);
    });

    it('should display info text - no files selected', () => {
        const props = {
            onDrop: jest.fn(),
            acceptedFiles: [],
        };
        const wrapper = mount(<ShapefileDropView {...props} />);
        const dropzoneContent = wrapper.find(DropzoneContent).first();
        const p = dropzoneContent.find('p').first();
        expect(p.text()).toBe(strings.shapefileDropView.dropText);
    });

    it('should display info text - files selected', () => {
        const props = {
            onDrop: jest.fn(),
            acceptedFiles: [{ name: 'a.shp' }, { name: 'b.shp' }],
        };
        const wrapper = mount(<ShapefileDropView {...props} />);
        const dropzoneContent = wrapper.find(DropzoneContent).first();
        const p = dropzoneContent.find('p').first();
        expect(p.text()).toBe(strings.shapefileDropView.selectedFilesText);
    });

    it('should display list of filenames - files selected', () => {
        const props = {
            onDrop: jest.fn(),
            acceptedFiles: [{ name: 'a.shp' }, { name: 'b.shp' }],
        };
        const wrapper = mount(<ShapefileDropView {...props} />);
        const dropzoneContent = wrapper.find(DropzoneContent).first();
        const lis = dropzoneContent.find('li');

        const shpLi = lis.at(0);
        const dbfLi = lis.at(1);

        expect(shpLi.text()).toBe('a.shp');
        expect(dbfLi.text()).toBe('b.shp');
    });

    it('should have correct text on button', () => {
        const props = {
            onDrop: jest.fn(),
            acceptedFiles: [],
        };

        const wrapper = mount(<ShapefileDropView {...props} />);
        const dropzoneContent = wrapper.find(DropzoneContent).first();
        const button = dropzoneContent.find(Button).first();
        expect(button.text()).toBe(strings.shapefileDropView.browse);
    });
});
