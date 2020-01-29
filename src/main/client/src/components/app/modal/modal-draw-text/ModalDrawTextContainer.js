// @flow
import { connect } from 'react-redux';
import ModalDrawText from './ModalDrawText';
import { setMapDrawText, setActiveTool } from '../../../../reducers/map/actions';

const mapDispatchToProps = dispatch => ({
    setDrawText: (text) => {
        dispatch(setMapDrawText(text));
    },
    setActiveTool: (tool) => {
        dispatch(setActiveTool(tool));
    },
});

const ModalDrawTextContainer = (connect(null, mapDispatchToProps)(ModalDrawText): any);

export default ModalDrawTextContainer;
