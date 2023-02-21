// @flow
import { connect } from 'react-redux';
import ModalDrawText from './ModalDrawText';
import { setMapDrawText, setActiveTool } from '../../../../reducers/map/actions';

const mapDispatchToProps = (dispatch: Function) => ({
    setDrawText: (text: any) => {
        dispatch(setMapDrawText(text));
    },
    setActiveTool: (tool: any) => {
        dispatch(setActiveTool(tool));
    },
});

const ModalDrawTextContainer = (connect(null, mapDispatchToProps)(ModalDrawText): any);

export default ModalDrawTextContainer;
