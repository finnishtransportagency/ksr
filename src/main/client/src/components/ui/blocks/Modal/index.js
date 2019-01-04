import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';
import { fadeInModal, fadeOutModal } from '../../keyframes/modal';
import Blur from './Blur';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';

const Modal = styled.div`
    background: ${styles.colorBackgroundWhite};
    color: ${styles.colorFontDark};
    position: fixed;
    right: 0;
    left: 0;
    top: 2rem;
    visibility: visible;
    margin: 0 auto;
    max-height: 90%;
    width: 700px;
    z-index: 1050;
    -webkit-box-shadow: ${styles.shadowDefault};
    -moz-box-shadow: ${styles.shadowDefault};
    box-shadow: ${styles.shadowDefault};
    border: none;
    transition: 0.6s;
    background: #FFFFFF;
    overflow: hidden;
    -webkit-animation: ${fadeInModal} 0.3s;
    -moz-animation: ${fadeInModal} 0.3s;
    -o-animation: ${fadeInModal} 0.3s;
    animation: ${fadeInModal} 0.3s;
    
    ${props => props.fadeOut && css`
        -webkit-animation: ${fadeOutModal} 0.3s;
        -moz-animation: ${fadeOutModal} 0.3s;
        -o-animation: ${fadeOutModal} 0.3s;
        animation: ${fadeOutModal} 0.3s;
    `};
    
    ${props => props.confirm && css`
        width: 350px;
    `};
    
    @media only screen and (max-width: 768px) {
        width: 90%;
    };
`;

Modal.Content = Content;
Modal.Header = Header;
Modal.Footer = Footer;
Modal.Blur = Blur;

export default Modal;
