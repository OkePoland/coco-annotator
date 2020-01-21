import { useRef, useEffect } from 'react';
import paper from 'paper';

import { Maybe, RasterSize } from '../../annotator.types';
import * as CONFIG from '../../annotator.config';

const useTitle = (rasterSize: Maybe<RasterSize>, leftTitle: string) => {
    const groupRef = useRef<Maybe<paper.Group>>(null);
    const leftTitleRef = useRef<Maybe<paper.PointText>>(null);
    const rightTitleRef = useRef<Maybe<paper.PointText>>(null);

    // init left and right title
    useEffect(() => {
        if (rasterSize != null) {
            const { width, height } = rasterSize;

            const fontSize = width * CONFIG.TITLE_FONT_SCALE;
            const positionTopLeft = new paper.Point(
                -width / 2,
                -height / 2 - fontSize * CONFIG.TITLE_HEIGHT_SCALE,
            );
            const positionTopRight = new paper.Point(
                width / 2,
                -height / 2 - fontSize * CONFIG.TITLE_HEIGHT_SCALE,
            );

            const leftTitle = new paper.PointText(positionTopLeft);
            leftTitle.remove();
            leftTitle.locked = false; // disable interactions with the mouse
            leftTitle.fontSize = fontSize;
            leftTitle.fillColor = new paper.Color('white');

            const rightTitle = new paper.PointText(positionTopRight);
            rightTitle.remove();
            rightTitle.locked = false; // disable interactions with the mouse
            rightTitle.justification = 'right';
            rightTitle.fontSize = fontSize;
            rightTitle.fillColor = new paper.Color('white');
            rightTitle.content = width + 'x' + height;

            leftTitleRef.current = leftTitle;
            rightTitleRef.current = rightTitle;

            if (groupRef.current === null) {
                const group = new paper.Group([
                    leftTitleRef.current,
                    rightTitleRef.current,
                ]);
                group.name = 'Title_Group';
                groupRef.current = group;
            }
        }
    }, [rasterSize]);

    // update right title on incoming data
    useEffect(() => {
        if (leftTitleRef.current != null) {
            leftTitleRef.current.content = leftTitle;

            // this.$nextTick(() => this.showAll());    // TODO
        }
    }, [leftTitle]);

    return null;
};
export default useTitle;
