import { useRef, useEffect } from 'react';
import paper from 'paper';

import { Maybe, ImageSize } from '../../annotator.types';
import * as CONFIG from '../../annotator.config';

const useTitle = (imageSize: Maybe<ImageSize>, leftTitleMsg: string) => {
    const groupRef = useRef<Maybe<paper.Group>>(null);
    const leftTitleRef = useRef<Maybe<paper.PointText>>(null);
    const rightTitleRef = useRef<Maybe<paper.PointText>>(null);

    // init left and right title
    useEffect(() => {
        if (imageSize != null) {
            const { width, height } = imageSize;

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
            leftTitle.fontSize = fontSize;
            leftTitle.fillColor = new paper.Color('white');

            const rightTitle = new paper.PointText(positionTopRight);
            rightTitle.remove();
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
                group.name = CONFIG.TITLE_GROUP_PREFIX;
                group.locked = true; // disable interactions with the mouse
                groupRef.current = group;
            }
        }
    }, [imageSize]);

    // update right title on incoming data
    useEffect(() => {
        if (leftTitleRef.current != null) {
            leftTitleRef.current.content = leftTitleMsg;

            // this.$nextTick(() => this.showAll());    // TODO
        }
    }, [groupRef, leftTitleMsg]);

    return null;
};
export default useTitle;
