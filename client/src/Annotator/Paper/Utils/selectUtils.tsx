import { Maybe, DataType, DataIndicator } from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

import { Keypoint } from '../Group';
import { isIndicator } from './typeGuards';

export const hitOptions = {
    segments: true,
    stroke: true,
    fill: false,
    tolerance: CONFIG.TOOLS_SELECT_INITIAL_HIT_TOLERANCE,
    match: (hit: { item: { data: Object } }) => {
        return !isIndicator(hit.item.data);
    },
};

export const hitOptionsFill = {
    segments: false,
    stroke: false,
    fill: true,
    tolerance: CONFIG.TOOLS_SELECT_INITIAL_HIT_TOLERANCE,
    match: (hit: { item: { data: Object } }) => {
        return !isIndicator(hit.item.data);
    },
};

export const createCircle = (
    point: paper.Point,
    radius: number,
    strokeWidth: number,
) => {
    const data: DataIndicator = { type: DataType.INDICATOR };

    const pt = new paper.Path.Circle(point, radius);
    pt.strokeColor = new paper.Color('black');
    pt.strokeWidth = strokeWidth;
    pt.data = data;

    return pt;
};

export const createTooltip = (
    position: paper.Point,
    rounded: number,
    fontSize: number,
    keypoint: Maybe<Keypoint>,
    categoryId: Maybe<number>,
    annotationId: Maybe<number>,
) => {
    // Create tooltip paper object
    const data: DataIndicator = { type: DataType.INDICATOR };

    const text = new paper.PointText(position);
    text.justification = 'left';
    text.fillColor = new paper.Color('black');
    text.content = keypoint
        ? createKeypointText(keypoint)
        : createShapeText(categoryId, annotationId);
    text.fontSize = fontSize;
    text.data = data;

    const box = new paper.Path.Rectangle(
        text.bounds,
        new paper.Size(rounded, rounded),
    );
    box.fillColor = new paper.Color('white');
    box.strokeColor = new paper.Color('white');
    box.opacity = 0.5;
    box.data = data;

    return { text, box };
};

const createShapeText = (
    categoryId: Maybe<number>,
    annotationId: Maybe<number>,
) => {
    // info text
    const msg = `CategoryId: ${categoryId}\nAnnotationId: ${annotationId}`
        .replace(/\n/g, ' \n ')
        .slice(0, -2);

    // metadataData text
    const metadata: Array<{ key: string; value: string }> = []; // TODO get
    let metaMsg = '';
    if (metadata && metadata.length > 0) {
        metaMsg += 'Metadata \n';
        metadata.forEach(e => {
            if (e.key.length !== 0) {
                metaMsg += ' ' + e.key + ' = ' + e.value + ' \n';
            }
        });
    } else metaMsg += 'No Metadata \n';

    metaMsg.replace(/\n/g, ' \n ').slice(0, -2);

    return msg + '\n' + metaMsg;
};

const createKeypointText = (keypoint: Keypoint) => {
    const id = keypoint.pointId;
    const msg = `Keypoint \n Id: ${id}`;
    msg.replace(/\n/g, ' \n ').slice(0, -2);
    return msg;
};