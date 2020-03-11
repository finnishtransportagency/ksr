// @flow
import { connect } from 'react-redux';
import ModalShowAddress from './ModalShowAddress';

const mapStateToProps = state => ({
    data: state.modal.activeModal.data,
});
	
const ModalShowAddressContainer = (connect(mapStateToProps, null)(ModalShowAddress): any);

export default ModalShowAddressContainer;
