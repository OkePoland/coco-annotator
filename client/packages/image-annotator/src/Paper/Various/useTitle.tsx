import { useRef, useEffect } from 'react';
import paper from 'paper';

import { Maybe, ImageSize } from '../../app.types';
import * as CONFIG from '../../app.config';

const useTitle = (imageSize: Maybe<ImageSize>, leftTitleMsg: string) => {
    const groupRef = useRef<Maybe<paper.Group>>(null);
    const leftTitleRef = useRef<Maybe<paper.PointText>>(null);
    const rightTitleRef = useRef<Maybe<paper.PointText>>(null);

    useEffect(() => {
        if (groupRef.current === null) {
            const leftTitle = new paper.PointText(new paper.Point(0, 0));
            const rightTitle = new paper.PointText(new paper.Point(0, 0));

            const group = new paper.Group([
                leftTitleRef.current,
                rightTitleRef.current,
            ]);
            group.name = CONFIG.TITLE_GROUP_PREFIX;
            group.locked = true; // disable interactions with the mouse
            groupRef.current = group;

            leftTitleRef.current = leftTitle;
            rightTitleRef.current = rightTitle;
        }
    }, []);

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
            leftTitle.fontSize = fontSize;
            leftTitle.fillColor = new paper.Color('white');
            leftTitle.content = leftTitleMsg;

            const rightTitle = new paper.PointText(positionTopRight);
            rightTitle.justification = 'right';
            rightTitle.fontSize = fontSize;
            rightTitle.fillColor = new paper.Color('white');
            rightTitle.content = width + 'x' + height;

            if (leftTitleRef.current)
                leftTitleRef.current.replaceWith(leftTitle);
            if (rightTitleRef.current)
                rightTitleRef.current.replaceWith(rightTitle);
        }
    }, [imageSize, leftTitleMsg]);

    useEffect(() => {
        if (leftTitleRef.current != null) {
            leftTitleRef.current.content = leftTitleMsg;
        }
    }, [groupRef, leftTitleMsg]);

    return null;
};
export default useTitle;
