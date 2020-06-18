import paper from 'paper';

import { Maybe, TooltipMetadata } from '../../app.types';

import * as CONFIG from '../../app.config';

import { KeypointShape } from '../Shape';
import { isIndicator, createIndicator } from './typeGuards';

export const hitOptions = {
    segments: true,
    stroke: false,
    fill: false,
    tolerance: CONFIG.TOOLS_SELECT_INITIAL_HIT_TOLERANCE,
    match: (hit: paper.HitResult) => {
        return !isIndicator(hit.item.data) && hit.item.parent.selected;
    },
};

export const hitOptionsFill = {
    segments: false,
    stroke: false,
    fill: true,
    tolerance: CONFIG.TOOLS_SELECT_INITIAL_HIT_TOLERANCE,
    selected: true,
    match: (hit: { item: { data: Object } }) => {
        return !isIndicator(hit.item.data);
    },
};

export const createCircle = (
    point: paper.Point,
    radius: number,
    strokeWidth: number,
) => {
    const pt = new paper.Path.Circle(point, radius);
    pt.strokeColor = new paper.Color('black');
    pt.strokeWidth = strokeWidth;
    pt.data = createIndicator();

    return pt;
};

export const createTooltip = (
    position: paper.Point,
    rounded: number,
    fontSize: number,
    keypoint: Maybe<KeypointShape>,
    categoryId: Maybe<number>,
    annotationId: Maybe<number>,
    tooltipMetadata: TooltipMetadata,
) => {
    // Create tooltip paper object
    const text = new paper.PointText(position);
    text.justification = 'left';
    text.fillColor = new paper.Color('black');
    text.content = keypoint
        ? createKeypointText(keypoint)
        : createShapeText(categoryId, annotationId, tooltipMetadata);
    text.fontSize = fontSize;
    text.data = createIndicator();

    const box = new paper.Path.Rectangle(
        text.bounds,
        new paper.Size(rounded, rounded),
    );
    box.fillColor = new paper.Color('white');
    box.strokeColor = new paper.Color('white');
    box.opacity = 0.5;
    box.data = createIndicator();

    return { text, box };
};

const createShapeText = (
    categoryId: Maybe<number>,
    annotationId: Maybe<number>,
    tooltipMetadata: TooltipMetadata,
) => {
    const msg = `CategoryId: ${categoryId}\nAnnotationId: ${annotationId}`;
    let metaMsg = '';
    if (
        annotationId != null &&
        tooltipMetadata[annotationId] != null &&
        tooltipMetadata[annotationId].length > 0
    ) {
        metaMsg += 'Metadata: \n';
        tooltipMetadata[annotationId].forEach(meta => {
            metaMsg += ' ' + meta.key + ' = ' + meta.value + ' \n';
        });
    } else metaMsg += 'No Metadata \n';
    metaMsg.replace(/\n/g, ' \n ').slice(0, -2);

    return msg + '\n' + metaMsg;
};

const createKeypointText = (keypoint: KeypointShape) => {
    const id = keypoint.pointId;
    const msg = `Keypoint \n Id: ${id}`;
    msg.replace(/\n/g, ' \n ').slice(0, -2);
    return msg;
};
