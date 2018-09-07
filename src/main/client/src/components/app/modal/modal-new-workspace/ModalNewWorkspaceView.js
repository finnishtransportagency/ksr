// @flow
import React from 'react';
import strings from '../../../../translations';
import { TextInput } from '../../../ui/elements';
import { InputWithIcon, InputInfo } from '../../../ui/elements/TextInput';
import LoadingIcon from '../../shared/LoadingIcon';
import { WorkspacenameInputWrapper } from './styles';

type Props = {
    handleInputChange: Function,
    workspaceName: string,
    submitDisabled: boolean,
    fetching: boolean,
};

const ModalNewWorkspaceView = ({
    handleInputChange,
    workspaceName,
    submitDisabled,
    fetching,
}: Props) => (
    <WorkspacenameInputWrapper>
        <label htmlFor={strings.modalNewWorkspace.workspaceName}>
            <span>{strings.modalNewWorkspace.workspaceName}</span>
            <InputWithIcon>
                <TextInput
                    backgroundDarker
                    type="text"
                    placeholder=""
                    name="name"
                    autoComplete="off"
                    onChange={handleInputChange}
                    value={workspaceName}
                    maxLength={30}
                />
                <InputInfo
                    data-balloon={!fetching && submitDisabled && workspaceName.trim()
                        ? strings.modalNewWorkspace.workspaceNameExists
                        : null
                    }
                    data-balloon-pos="left"
                    data-balloon-length="large"
                >
                    {!fetching && !submitDisabled && workspaceName.trim() && <i className="fas fa-check" />}
                    {!fetching && submitDisabled && workspaceName.trim() && <i className="fas fa-exclamation-triangle" />}
                    <LoadingIcon size={7} loading={fetching} />
                </InputInfo>
            </InputWithIcon>
        </label>
    </WorkspacenameInputWrapper>
);

export default ModalNewWorkspaceView;
