// @flow
import { connect } from 'react-redux';
import { getActiveNav } from '../../../reducers/navigation/actions';
import SideBarView from './SideBarView';

const mapStateToProps = (state: Object) => ({
    activeNav: state.navigation.activeNav,
});

const mapDispatchToProps = (dispatch: Function) => ({
    getActiveNav: () => {
        dispatch(getActiveNav());
    },
});

const SideBarContainer = (connect(mapStateToProps, mapDispatchToProps)(SideBarView): any);

export default SideBarContainer;
