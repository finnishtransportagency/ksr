import { connect } from 'react-redux';
import { setActiveNav } from '../../../../reducers/sideNav/actions';
import SideNav from './SideNav';

const mapStateToProps = state => ({
    navActive: state.sideNav.navSelected,
});

const mapDispatchToProps = dispatch => ({
    setActiveNav: (selectedNav) => {
        dispatch(setActiveNav(selectedNav));
    },
});

const SideNavContainer = connect(mapStateToProps, mapDispatchToProps)(SideNav);

export default SideNavContainer;
