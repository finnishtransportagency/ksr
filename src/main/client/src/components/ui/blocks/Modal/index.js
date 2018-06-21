import styled from 'styled-components';
import * as styles from '../../defaultStyles';
import Blur from './Blur';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';

const Modal = styled.div`
    background: ${styles.colorBackgroundLight};
    color: ${styles.colorFontDark};
    position: fixed;
    right: 0;
    left: 0;
    top: ${props => (props.modalOpen ? '2rem' : '0')};
    opacity: ${props => (props.modalOpen ? '1' : '0')};
    visibility: ${props => (props.modalOpen ? 'visible' : 'hidden')};
    margin: 0 auto;
    max-height: 90%;
    max-width: 90%;
    overflow: auto;
    z-index: 1050;
    -webkit-box-shadow: ${styles.shadowDefault};
    -moz-box-shadow: ${styles.shadowDefault};
    box-shadow: ${styles.shadowDefault};
    border: none;
    transition: 0.6s;
    
    @media only screen and (max-width: 768px) {
        width: 90%;
    }
`;

Modal.Content = Content;
Modal.Header = Header;
Modal.Footer = Footer;
Modal.Blur = Blur;

export default Modal;
