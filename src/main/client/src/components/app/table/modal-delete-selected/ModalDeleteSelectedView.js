// @flow
import React, { Fragment } from 'react';
import strings from '../../../../translations';
import { TextArea, FilteredDataTable } from './styles';

type Props = {
    selectedData: Array<Object>,
    deleteComment: string,
    handleTextareaChange: Function,
    filteredData: Array<Object>,
};

const ModalDeleteSelectedView = ({
    selectedData,
    deleteComment,
    handleTextareaChange,
    filteredData,
}: Props) => (
    <Fragment>
        <label htmlFor="comment">{strings.modalDeleteSelected.commentLabel}</label>
        <TextArea id="comment" value={deleteComment} onChange={handleTextareaChange} />
        <p>{strings.modalDeleteSelected.deleteAmount}: { selectedData.length }</p>
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
    </Fragment>
);

export default ModalDeleteSelectedView;
