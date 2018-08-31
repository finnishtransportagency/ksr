// @flow
import { connect } from 'react-redux';
import { setActiveModal } from '../../../../reducers/modal/actions';
import { setActiveNav } from '../../../../reducers/navigation/actions';
import Workspace from './Workspace';

const mapStateToProps = state => ({
    activeNav: state.navigation.activeNav,
});

const mapDispatchToProps = dispatch => ({
    setActiveNav: (selectedNav) => {
        dispatch(setActiveNav(selectedNav));
    },
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
});

const WorkspaceContainer = connect(mapStateToProps, mapDispatchToProps)(Workspace);

export default WorkspaceContainer;
