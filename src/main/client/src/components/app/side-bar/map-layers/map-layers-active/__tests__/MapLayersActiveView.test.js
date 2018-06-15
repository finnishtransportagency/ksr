import React from 'react';
import { shallow } from 'enzyme';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayersActiveView from '../MapLayersActiveView';

const setup = () => {
    const props = {
        activeLayers: [
            {
                id: 1,
                name: 'test',
            },
        ],
        onDragEnd: () => {},
    };
    const wrapper = shallow(<MapLayersActiveView {...props} />);

    return { props, wrapper };
};

describe('<MapLayersActiveView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(DragDropContext).length).toBe(1);
    });

    it('should render Droppable element', () => {
        const dragDrop = wrapper.find(DragDropContext);
        expect(dragDrop.find(Droppable).length).toBe(1);
    });
});
