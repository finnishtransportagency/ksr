import { connect } from 'react-redux';
import { setActiveNav } from '../../../../reducers/navigation/actions';
import SideNav from './SideNav';

const mapStateToProps = state => ({
    activeNav: state.navigation.activeNav,
});

const mapDispatchToProps = dispatch => ({
    setActiveNav: (selectedNav) => {
        dispatch(setActiveNav(selectedNav));
    },
});

const SideNavContainer = connect(mapStateToProps, mapDispatchToProps)(SideNav);

export default SideNavContainer;
