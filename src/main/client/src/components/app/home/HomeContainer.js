// @flow
import { connect } from 'react-redux';
import { getLayerGroups } from '../../../reducers/map/actions';
import Home from './Home';

const mapDispatchToProps = dispatch => ({
    getLayerGroups: () => {
        dispatch(getLayerGroups());
    },
});

const HomeContainer = connect(null, mapDispatchToProps)(Home);

export default HomeContainer;
