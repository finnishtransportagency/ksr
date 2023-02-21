// @flow
import { connect } from 'react-redux';
import { setActiveNav } from '../../../reducers/navigation/actions';
import SideNavView from './SideNavView';

const mapStateToProps = (state: Object) => ({
    activeNav: state.navigation.activeNav,
});

const mapDispatchToProps = (dispatch: Function) => ({
    setActiveNav: (selectedNav: any) => {
        dispatch(setActiveNav(selectedNav));
    },
});

const SideNavContainer = (connect(mapStateToProps, mapDispatchToProps)(SideNavView): any);

export default SideNavContainer;
