import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Content = styled.div`
    flex: 9;
    background: ${styles.colorBackgroundLight};
    color: ${styles.colorFontDark};
    display: flex;
    transition: 0.3s;
    -webkit-box-shadow: ${styles.shadowDefault};
    -moz-box-shadow: ${styles.shadowDefault};
    box-shadow: ${styles.shadowDefault};
    border-left: 5px solid transparent;
    user-select: none;
    margin: 0.5rem 0;
`;

export default Content;
