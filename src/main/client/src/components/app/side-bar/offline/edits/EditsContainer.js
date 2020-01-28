// @flow
import { connect } from 'react-redux';

import { retryEdits, removeEdits } from '../../../../../reducers/offline/actions';
import EditsView from './EditsView';

const mapStateToProps = state => ({
    count: state.offline.count,
});

const mapDispatchToProps = dispatch => ({
    retryEdits: () => {
        dispatch(retryEdits());
    },
    removeEdits: () => {
        dispatch(removeEdits());
    },
});

const EditsContainer = (connect(mapStateToProps, mapDispatchToProps)(EditsView): any);

export default EditsContainer;
