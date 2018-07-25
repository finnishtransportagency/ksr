// @flow

/**
 * TODO: Save editedData to arcgis server
 * This doesn't do anything yet, just some looping and console logging edited changes
 */
export const saveEditedData = (originalData: Array<Object>, editedData: Array<Object>) => {
    const filteredEdit = editedData.map(ed => ({
        id: ed.id,
        title: ed.title,
        editedAttributes: ed.data.filter(data => data._edited.length > 0).map(d => d._edited),
    }));
    filteredEdit.forEach((f) => {
        console.log(f.title);
        f.editedAttributes.forEach(att => att.forEach(a => console.log(`${a.originalData} => ${a.editedData}`)));
    });
    console.log('save data to arcserver');
};
