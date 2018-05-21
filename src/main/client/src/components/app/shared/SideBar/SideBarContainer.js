import { connect } from 'react-redux';
import { getActiveNav } from '../../../../reducers/navigation/actions';
import SideBarView from './SideBarView';

const mapStateToProps = state => ({
    activeNav: state.navigation.activeNav,
});

const mapDispatchToProps = dispatch => ({
    getActiveNav: () => {
        dispatch(getActiveNav());
    },
});

const SideBarContainer = connect(mapStateToProps, mapDispatchToProps)(SideBarView);

export default SideBarContainer;
