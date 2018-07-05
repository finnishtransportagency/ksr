import Modal from '../../../ui/blocks/Modal';

export const ModalFilter = Modal.extend`
    
    .content-filter {
      display: flex;
      flex-wrap: wrap;
    }
    
    .content-checkbox {
      flex: 1 0 20%;
    }
    
    @media only screen and (max-width: 768px) {
        .content-filter {
          display: block;
        }
    }
`;
