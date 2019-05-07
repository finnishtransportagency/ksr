import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    
    &:hover {
        cursor: pointer;
    }
`;

const Zoom = styled.div`
    padding: 1rem;
    outline: none;
    
    &:hover {
        color: ${styles.colorMainDark};
    }
`;

const Toggle = styled.div`
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    outline: none;
    
    &:hover {
        .fa-chevron-up, .fa-chevron-down {
            color: ${styles.colorMainDark};
        }
    }
`;

Header.Zoom = Zoom;
Header.Toggle = Toggle;

export default Header;
