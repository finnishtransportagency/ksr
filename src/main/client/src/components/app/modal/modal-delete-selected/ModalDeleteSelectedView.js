// @flow
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import strings from '../../../../translations';
import { TextArea, FilteredDataTable } from './styles';

type Props = {
    deleteComment: string,
    handleTextareaChange: Function,
    filteredData: Array<Object>,
};

const ModalDeleteSelectedView = ({
    deleteComment,
    handleTextareaChange,
    filteredData,
}: Props) => (
    <Fragment>
        <label htmlFor="comment">{strings.modalDeleteSelected.commentLabel}</label>
        <TextArea id="comment" value={deleteComment} onChange={handleTextareaChange} maxLength={300} />
        <p>{strings.modalDeleteSelected.deleteAmount}: { filteredData.length }</p>

        {filteredData.length &&
                <Scrollbars
                    autoHide={(filteredData.length < 2)}
                    autoHeight
                    autoHeightMax={200}
                >
                    <FilteredDataTable>
                        <thead>
                            <tr>
                                {Object.keys(filteredData[0]).map(t => t !== '_id' && <th key={t}>{t}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(fd => (
                                <tr key={fd._id}>
                                    {Object.keys(fd).map(a => a !== '_id' && <td key={fd._id + a}>{fd[a]}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </FilteredDataTable>
                </Scrollbars>
        }
    </Fragment>
);

export default ModalDeleteSelectedView;
