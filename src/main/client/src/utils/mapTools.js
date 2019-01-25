// @flow
import * as styles from '../components/ui/defaultStyles';

/**
 * Resets draw, sketchViewModel, activeTool and resets button highlights
 * This makes sure that only one tool can be activated at same time
 *
 * @param draw Object esri draw stored in redux
 * @param sketchViewModel Object esri sketchViewModel stored in redux
 * @param setActiveTool Function sets current active tool
 *
 */
export const resetMapTools = (draw: Object, sketchViewModel: Object, setActiveTool: Function) => {
    draw.reset();
    sketchViewModel.reset();
    setActiveTool('');
    [...document.getElementsByClassName('esri-widget--button:not(#toggle-measurements)')]
        .forEach((element) => {
            element.style.background = styles.colorMain;
        });
};

/**
* Removes temporary drawings from the view.
* Temporary drawings are drawings where graphic.complete is false
*
* @param view Object Esri MapView
*/
export const removeTemporaryDrawings = (view: Object) => {
    // Removes temporary drawings (graphic.complete === false)
    const graphicsToRemove = view.graphics
        .filter(g => (g.type === 'draw-graphic' || g.type === 'draw-measure-label') && !g.complete);
    view.graphics.removeMany(graphicsToRemove);
};
