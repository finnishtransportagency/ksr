// @flow
import styled from 'styled-components';
import React, { useEffect, useRef } from 'react';
import strings from '../../../../translations';
import CloseButtonContainer from './CloseButtonContainer';
import HelpModalView from './HelpModalView';

const HelpModalContainer = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.5);
  z-index: 9999;
`;

type Props = {
  onClickOutside: Function,
}

function HelpModal({ onClickOutside }: Props) {
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutside();
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [onClickOutside]);

    return (
        <HelpModalContainer>
            <HelpModalView ref={ref}>
                {strings.helpModal.text}
                {' '}
                <a href={`mailto:${strings.helpModal.email}`}>{strings.helpModal.email}</a>
                <CloseButtonContainer onClick={onClickOutside}>
                    <i className="fas fa-times" />
                </CloseButtonContainer>
            </HelpModalView>
        </HelpModalContainer>
    );
}

export default HelpModal;
