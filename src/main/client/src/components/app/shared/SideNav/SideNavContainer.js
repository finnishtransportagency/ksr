import { connect } from 'react-redux';
import { setActiveNav } from '../../../../reducers/navigation/actions';
import SideNavView from './SideNavView';

const mapStateToProps = state => ({
    activeNav: state.navigation.activeNav,
});

const mapDispatchToProps = dispatch => ({
    setActiveNav: (selectedNav) => {
        dispatch(setActiveNav(selectedNav));
    },
});

const SideNavContainer = connect(mapStateToProps, mapDispatchToProps)(SideNavView);

export default SideNavContainer;
