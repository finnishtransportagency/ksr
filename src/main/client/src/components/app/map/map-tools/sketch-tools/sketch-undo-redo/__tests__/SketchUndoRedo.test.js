import React from 'react';
import { shallow } from 'enzyme';
import SketchUndoRedo from '../SketchUndoRedo';

const setUp = (canRedo, canUndo, show) => {
    const redoMock = jest.fn();
    const undoMock = jest.fn();
    const wrapper = shallow(
        <SketchUndoRedo
            redo={redoMock}
            undo={undoMock}
            canRedo={canRedo}
            canUndo={canUndo}
            show={show}
        />,
    );
    return {
        redoMock,
        undoMock,
        wrapper,
    };
};

describe('<SketchUndoRedo />', () => {
    it('should render visible redo and undo buttons', () => {
        const { wrapper } = setUp(false, false, true);
        const undoWrapper = wrapper.find('#undo-new-feature');
        expect(undoWrapper).toBeDefined();
        expect(undoWrapper.props().style.visibility).toEqual('visible');
        const redoWrapper = wrapper.find('#redo-new-feature');
        expect(redoWrapper).toBeDefined();
        expect(redoWrapper.props().style.visibility).toEqual('visible');
    });

    it('should render hidden redo and undo buttons', () => {
        const { wrapper } = setUp(false, false, false);
        const undoWrapper = wrapper.find('#undo-new-feature');
        expect(undoWrapper).toBeDefined();
        expect(undoWrapper.props().style.visibility).toEqual('hidden');
        const redoWrapper = wrapper.find('#redo-new-feature');
        expect(redoWrapper).toBeDefined();
        expect(redoWrapper.props().style.visibility).toEqual('hidden');
    });

    it('should call prop functions if button visible', () => {
        const { redoMock, undoMock, wrapper } = setUp(true, true, true);
        const undoWrapper = wrapper.find('#undo-new-feature');
        undoWrapper.simulate('click');
        expect(undoMock).toBeCalled();
        const redoWrapper = wrapper.find('#redo-new-feature');
        redoWrapper.simulate('click');
        expect(redoMock).toBeCalled();
    });

    it('should not call prop functions if button visible', () => {
        const { redoMock, undoMock, wrapper } = setUp(false, false, true);
        const undoWrapper = wrapper.find('#undo-new-feature');
        undoWrapper.simulate('click');
        expect(undoMock).not.toBeCalled();
        const redoWrapper = wrapper.find('#redo-new-feature');
        redoWrapper.simulate('click');
        expect(redoMock).not.toBeCalled();
    });
});
