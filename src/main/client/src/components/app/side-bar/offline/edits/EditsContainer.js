// @flow
import { connect } from 'react-redux';

import { retryEdits, removeEdits } from '../../../../../reducers/offline/actions';
import EditsView from './EditsView';

const mapStateToProps = (state: Object) => ({
    count: state.offline.count,
});

const mapDispatchToProps = (dispatch: Function) => ({
    retryEdits: () => {
        dispatch(retryEdits());
    },
    removeEdits: () => {
        dispatch(removeEdits());
    },
});

const EditsContainer = (connect(mapStateToProps, mapDispatchToProps)(EditsView): any);

export default EditsContainer;
