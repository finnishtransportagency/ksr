import styled from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

const HelpModal = styled.div`
  padding: 4rem;
  background: ${styles.colorBackgroundDark};
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  color: ${styles.colorBackgroundLight};
  position: relative;
  
  a {
    color: ${styles.colorBackgroundLight};
  }
`;

export default HelpModal;
