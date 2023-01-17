// @flow
import React from 'react';
import { H2, Button } from '../../../../ui/elements';
import { EditsWrapper } from './styles';
import strings from '../../../../../translations/fi';

type Props = {
    count: number,
    retryEdits: Function,
    removeEdits: Function,
};

function EditsView({ count, retryEdits, removeEdits }: Props) {
    return (
        <EditsWrapper>
            <H2>{strings.offline.edits.title}</H2>
            <p>
                {
                    count === 0
                        ? strings.offline.edits.noEdits
                        : `${count} ${strings.offline.edits.hasEdits}`
                }
            </p>
            { count > 0
            && (
                <>
                    <Button onClick={retryEdits}>
                        {strings.offline.edits.save}
                    </Button>
                    <Button onClick={removeEdits}>
                        {strings.offline.edits.remove}
                    </Button>
                </>
            )}
        </EditsWrapper>
    );
}

export default EditsView;
