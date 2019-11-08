// @flow

/**
 * Resets draw, sketchViewModel, activeTool and button highlights.
 * This makes sure that only one tool can be activated at a time.
 *
 * @param {Object}draw Esri draw stored in redux.
 * @param {Object} sketchViewModel Esri sketchViewModel stored in redux.
 * @param {Function} setActiveTool Set currently active tool.
 */
export const resetMapTools = (draw: Object, sketchViewModel: Object, setActiveTool: Function) => {
    draw.reset();
    sketchViewModel.cancel();
    setActiveTool('');
    [...document.querySelectorAll('.esri-ui-top-right .esri-widget--button:not(#toggle-measurements)')]
        .forEach((element) => {
            element.style.removeProperty('background');
        });
};

/**
* Removes temporary drawings from the view.
* Temporary drawings are drawings where graphic.complete is false.
*
* @param {Object} view Esri MapView.
*/
export const removeTemporaryDrawings = (view: Object) => {
    // Removes temporary drawings (graphic.complete === false)
    const graphicsToRemove = view.graphics
        .filter(g => (g.type === 'draw-graphic' || g.type === 'draw-measure-label') && !g.complete);
    view.graphics.removeMany(graphicsToRemove);
};
