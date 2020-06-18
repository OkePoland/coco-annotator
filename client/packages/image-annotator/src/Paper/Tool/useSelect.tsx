/**
 * Tool to select things & Display tooltips
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import paper from 'paper';

import {
    Maybe,
    MouseEvent,
    ToolSettingsSelect,
    TooltipMetadata,
} from '../../app.types';

import * as CONFIG from '../../app.config';

import { AnnotationShape, KeypointShape } from '../Shape';
import {
    isAnnotationShape,
    isKeypointGroup,
    isKeypointShape,
} from '../Utils/typeGuards';
import {
    hitOptions,
    hitOptionsFill,
    createCircle,
    createTooltip,
} from '../Utils/selectUtils';

// interfaces
interface IToolSelect {
    (
        paperRef: React.MutableRefObject<Maybe<paper.PaperScope>>,
        isActive: boolean,
        scale: number,
        tooltipMetadata: TooltipMetadata,
        preferences: Maybe<ToolSettingsSelect>,
    ): ToolSelectResponse;
}
export interface ToolSelectResponse {
    settings: ToolSettingsSelect;
    setTooltipOn: (isOn: boolean) => void;
}
interface Cache {
    shape: {
        segment: Maybe<paper.Segment>; // reference to SELECTED segment (point) in some AnnotationShape
        obj: Maybe<AnnotationShape>; // reference for SELECTED AnnotationShape
        isBBOX: boolean; // whether SELECTED segment belongs to AnnotationShape-BBOX
        initPoint: Maybe<paper.Point>; // point in middle of AnnotationShape-BBOX fill which we use as 'move center'
    };
    keypoint: {
        obj: Maybe<KeypointShape>; // reference to SELECTED keypoint
        isMoving: boolean; // whether SELECTED keypoint if moving
    };
    hover: {
        position: paper.Point; // hovered position
        keypoint: Maybe<KeypointShape>; // reference for HOVERED keypoint
        shape: {
            categoryId: Maybe<number>; // hovered annotation CategoryId
            annotationId: Maybe<number>; // hovered annotation Id
        };
    };
    circle: {
        obj: Maybe<paper.Path.Circle>; // reference for circle shape around hovered point
        center: Maybe<paper.Point>; // center point of circle
        radius: number; // radius of circle
        strokeWidth: number; // stroke of circle
        canMove: boolean; // whether we can move circle
    };
    tooltip: {
        box: Maybe<paper.Path.Rectangle>; // reference for tooltip background
        text: Maybe<paper.PointText>; // reference for tooltip text shape
        textId: number; // id of annotation for which Tooltip was generated
        totalShift: number; // shift of whole tooltip (based on scale)
        textShift: number; // shift of tooltip TEXT (based on scale)
        fontSize: number; // fontsize of tooltip (based on scale)
        rounded: number; // radius of tooltip box (based on scale)
    };
}

export const useSelect: IToolSelect = (
    paperRef,
    isActive,
    scale,
    tooltipMetadata,
    preferences,
) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);
    const cache = useRef<Cache>({
        shape: {
            segment: null,
            obj: null,
            isBBOX: false,
            initPoint: null,
        },
        keypoint: {
            obj: null,
            isMoving: false,
        },
        hover: {
            position: new paper.Point(0, 0),
            keypoint: null,
            shape: {
                categoryId: null,
                annotationId: null,
            },
        },
        circle: {
            obj: null,
            center: null,
            radius: 0,
            strokeWidth: 0,
            canMove: false,
        },
        tooltip: {
            box: null,
            text: null,
            textId: -1,
            totalShift: 0,
            textShift: 0,
            fontSize: 3,
            rounded: 0,
        },
    });
    const [settings, _setSettings] = useState<ToolSettingsSelect>({
        tooltipOn: CONFIG.TOOLS_SELECT_INITIAL_TOOLTIP_ON,
    });

    // private actions
    const _createCircle = useCallback((point: paper.Point) => {
        if (cache.current.circle.obj != null) {
            cache.current.circle.obj.remove();
        }
        const circle = createCircle(
            point,
            cache.current.circle.radius,
            cache.current.circle.strokeWidth,
        );
        cache.current.circle.obj = circle;
    }, []);

    const _removeCircle = useCallback(() => {
        if (!cache.current.circle.obj) return;
        cache.current.circle.obj.remove();
        cache.current.circle.obj = null;
    }, []);

    const _adjustTooltip = useCallback(() => {
        if (!settings.tooltipOn) return;

        const position = cache.current.hover.position.add(
            cache.current.tooltip.textShift,
        );

        // Check if Tooltip exist for hovered point
        // In case yes - adjust content
        // In case no - create ne one
        if (
            !cache.current.tooltip.text ||
            cache.current.hover.shape.annotationId !==
                cache.current.tooltip.textId ||
            cache.current.hover.keypoint != null
        ) {
            if (cache.current.tooltip.text) cache.current.tooltip.text.remove();
            if (cache.current.tooltip.box) cache.current.tooltip.box.remove();
            if (cache.current.hover.shape.annotationId) {
                cache.current.tooltip.textId =
                    cache.current.hover.shape.annotationId || -1;
            }

            const { keypoint, shape } = cache.current.hover;

            const ttip = createTooltip(
                position,
                cache.current.tooltip.rounded,
                cache.current.tooltip.fontSize,
                keypoint,
                shape.categoryId,
                shape.annotationId,
                tooltipMetadata,
            );
            cache.current.tooltip.text = ttip.text;
            cache.current.tooltip.box = ttip.box;
        }

        // Adjust Tooltip position
        if (cache.current.tooltip.text) {
            cache.current.tooltip.totalShift =
                (cache.current.tooltip.text.bounds.bottomRight.x -
                    cache.current.tooltip.text.bounds.bottomLeft.x) /
                2;
        }
        if (cache.current.tooltip.box) {
            cache.current.tooltip.box.position = position.add(
                cache.current.tooltip.totalShift,
            );
            cache.current.tooltip.box.bringToFront();
        }
        if (cache.current.tooltip.text) {
            cache.current.tooltip.text.position = position.add(
                cache.current.tooltip.totalShift,
            );
            cache.current.tooltip.text.bringToFront();
        }
    }, [settings.tooltipOn, tooltipMetadata]);

    const _clear = useCallback(() => {
        cache.current.hover.shape.categoryId = null;
        cache.current.hover.shape.annotationId = null;

        cache.current.shape.segment = null;
        cache.current.shape.obj = null;
        cache.current.shape.isBBOX = false;
        cache.current.shape.initPoint = null;

        if (cache.current.tooltip.text) {
            cache.current.tooltip.text.remove();
            cache.current.tooltip.text = null;
        }
        if (cache.current.tooltip.box) {
            cache.current.tooltip.box.remove();
            cache.current.tooltip.box = null;
        }
    }, []);

    const setTooltipOn = useCallback((isOn: boolean) => {
        _setSettings(oldState => ({ ...oldState, tooltipOn: isOn }));
    }, []);

    // mouse events
    const onMouseDown = useCallback(
        (event: MouseEvent) => {
            if (!paperRef.current) return;

            const project = paperRef.current.project;
            const { point, modifiers } = event;

            const hitResult = project.hitTest(point, hitOptions); // hit result on segment

            if (!hitResult) {
                // If we did not hit the segment nor keypoint - try to hit shape fill
                // in case we clicked BBOX fill - initialize BBOX move
                const hitResultFill = project.hitTest(point, hitOptionsFill);
                if (
                    hitResultFill &&
                    hitResultFill.item &&
                    isAnnotationShape(hitResultFill.item) &&
                    hitResultFill.item.isBBOX
                ) {
                    cache.current.shape.isBBOX = true;
                    cache.current.shape.obj = hitResultFill.item;
                    cache.current.shape.initPoint = point;
                }
                return;
            }
            const { item, type } = hitResult;

            if (isKeypointShape(item)) {
                // remove KeypointShape onClick
                if (modifiers && modifiers.shift) {
                    if (item && isKeypointGroup(item.parent)) {
                        cache.current.keypoint.obj = null;
                        item.parent.removeKeypoint(item);
                    }
                    return;
                }
                // unselect point if the same point was clicked
                if (cache.current.keypoint.obj === item) {
                    cache.current.keypoint.obj = null;
                    return;
                }
                // select point if there was nothing selected previously
                if (cache.current.keypoint.obj === null) {
                    cache.current.keypoint.obj = item;
                    return;
                }
                // link / unlink selected keypoint with another
                if (cache.current.keypoint.obj) {
                    const keypoint = cache.current.keypoint.obj;
                    const parent = keypoint.parent;
                    const itemParent = item.parent;

                    if (
                        isKeypointGroup(parent) &&
                        isKeypointGroup(itemParent) &&
                        parent.data.annotationId ===
                            itemParent.data.annotationId
                    ) {
                        parent.linkKeypoints(keypoint, item);
                    }
                    cache.current.keypoint.obj = null;
                    return;
                }
                return;
            }

            if (isAnnotationShape(item.parent)) {
                // remove segment from AnnotationShape
                if (modifiers && modifiers.shift) {
                    if (type === 'segment') hitResult.segment.remove();
                    return;
                }

                // select segment from AnnotationShape
                if (type === 'segment') {
                    cache.current.shape.segment = hitResult.segment;
                }
                cache.current.shape.isBBOX = item.parent.isBBOX || false;

                if (cache.current.circle.obj) {
                    cache.current.circle.canMove = cache.current.circle.obj.contains(
                        point,
                    );
                } else {
                    cache.current.circle.canMove = false;
                }
            }
        },
        [paperRef],
    );

    const onMouseMove = useCallback(
        (event: MouseEvent) => {
            if (!paperRef.current) return;

            const project = paperRef.current.project;

            // Display / Hide Circle around AnnotationShape segment
            const drawCircle = () => {
                const hitResult = project.hitTest(event.point, hitOptions);

                if (!hitResult) {
                    _removeCircle();
                    return;
                }
                if (!isAnnotationShape(hitResult.item.parent)) {
                    _removeCircle();
                    return;
                }

                let point = null;
                if (hitResult.type === 'segment') {
                    point = hitResult.segment.location.point;
                } else if (hitResult.type === 'stroke') {
                    point = hitResult.location.point;
                }

                if (point != null) {
                    cache.current.circle.center = point;
                    _createCircle(point);
                } else {
                    _removeCircle();
                }
            };
            drawCircle();

            // Display / Hide Tooltip
            cache.current.hover.keypoint = null;

            if (event.item && event.item instanceof paper.Group) {
                const groupHit = event.item.hitTest(event.point);
                if (isAnnotationShape(groupHit.item)) {
                    const { categoryId, annotationId } = groupHit.item.data;
                    cache.current.hover.position = event.point;
                    cache.current.hover.shape.categoryId = categoryId;
                    cache.current.hover.shape.annotationId = annotationId;
                    if (cache.current.hover.shape.categoryId != null) {
                        _adjustTooltip();
                    }
                } else if (isKeypointShape(groupHit.item)) {
                    cache.current.hover.position = event.point;
                    cache.current.hover.keypoint = groupHit.item;
                    _adjustTooltip();
                } else {
                    _clear();
                }
            } else {
                _clear();
            }
        },
        [paperRef, _createCircle, _removeCircle, _adjustTooltip, _clear],
    );

    const onMouseDrag = useCallback(
        (event: MouseEvent) => {
            // KeypointShape Drag
            if (cache.current.keypoint.obj) {
                cache.current.keypoint.isMoving = true;
                const keypoint = cache.current.keypoint.obj;
                if (isKeypointGroup(keypoint.parent)) {
                    keypoint.parent.moveKeypoint(keypoint, event.point);
                }
                return;
            }

            // AnnotationShape-BBOX some point drag => moving BBOX
            if (
                cache.current.shape.isBBOX &&
                cache.current.shape.obj &&
                cache.current.shape.initPoint
            ) {
                const delta_x = cache.current.shape.initPoint.x - event.point.x;
                const delta_y = cache.current.shape.initPoint.y - event.point.y;

                const child = cache.current.shape.obj.children[0]; // AnnotationShape BBOX has only one children
                if (child instanceof paper.Path) {
                    const segments = child.segments;
                    segments.forEach(segment => {
                        const p = segment.point;
                        segment.point = new paper.Point(
                            p.x - delta_x,
                            p.y - delta_y,
                        );
                    });
                    cache.current.shape.initPoint = event.point;
                }
            }

            // AnnotationShape Segment Drag
            if (cache.current.shape.segment && cache.current.circle.canMove) {
                _createCircle(event.point);

                // AnnotationShape-BBOX segment drag => resizing BBOX
                if (cache.current.shape.segment && cache.current.shape.isBBOX) {
                    console.log('BBOX resize');
                    const isCounterClock =
                        cache.current.shape.segment.previous.point.x ===
                        cache.current.shape.segment.point.x;
                    const prev = isCounterClock
                        ? cache.current.shape.segment.previous
                        : cache.current.shape.segment.next;
                    const next = !isCounterClock
                        ? cache.current.shape.segment.previous
                        : cache.current.shape.segment.next;
                    prev.point = new paper.Point(event.point.x, prev.point.y);
                    next.point = new paper.Point(next.point.x, event.point.y);
                }

                // move AnnotationShape segment
                cache.current.shape.segment.point = event.point;
            }
        },
        [_createCircle],
    );

    const onMouseUp = useCallback(
        (event: MouseEvent) => {
            if (cache.current.keypoint.obj && cache.current.keypoint.isMoving) {
                cache.current.keypoint.isMoving = false;
                cache.current.keypoint.obj = null;
            } else _clear();
        },
        [_clear],
    );

    // Adjust preferences
    useEffect(() => {
        _setSettings(oldState => {
            const newState = { ...oldState };
            if (preferences && preferences.tooltipOn != null)
                newState.tooltipOn = preferences.tooltipOn;
            return newState;
        });
    }, [preferences]);

    // tool effects
    useEffect(() => {
        if (!toolRef.current) toolRef.current = new paper.Tool();

        toolRef.current.onMouseMove = onMouseMove;
        toolRef.current.onMouseDown = onMouseDown;
        toolRef.current.onMouseDrag = onMouseDrag;
        toolRef.current.onMouseUp = onMouseUp;
    }, [onMouseDown, onMouseDrag, onMouseMove, onMouseUp]);

    useEffect(() => {
        cache.current.tooltip.rounded =
            scale * CONFIG.TOOLS_SELECT_SCALE_ROUNDED;
        cache.current.tooltip.textShift =
            scale * CONFIG.TOOLS_SELECT_SCALE_TEXT_SHIFT;
        cache.current.tooltip.fontSize =
            scale * CONFIG.TOOLS_SELECT_SCALE_FONTSIZE;

        cache.current.circle.radius =
            scale * CONFIG.TOOLS_SELECT_SCALE_INDICATOR_SIZE;
        cache.current.circle.strokeWidth =
            scale * CONFIG.TOOLS_SELECT_SCALE_INDICATOR_WIDTH;

        if (cache.current.circle.obj && cache.current.circle.center) {
            _createCircle(cache.current.circle.center);
        }

        if (cache.current.tooltip.text) {
            cache.current.tooltip.text.fontSize =
                cache.current.tooltip.fontSize;
            cache.current.tooltip.totalShift =
                (cache.current.tooltip.text.bounds.bottomRight.x -
                    cache.current.tooltip.text.bounds.bottomLeft.x) /
                2;
            const totalShift =
                cache.current.tooltip.totalShift +
                cache.current.tooltip.textShift;
            cache.current.tooltip.text.position = cache.current.hover.position.add(
                totalShift,
            );
            if (cache.current.tooltip.box) {
                cache.current.tooltip.box.bounds =
                    cache.current.tooltip.text.bounds;
            }
        }
    }, [scale, _createCircle]);

    useEffect(() => {
        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        } else {
            // Clear whole cache
            cache.current.shape.segment = null;
            cache.current.shape.obj = null;
            cache.current.shape.isBBOX = false;
            cache.current.shape.initPoint = null;

            if (cache.current.keypoint.obj) {
                cache.current.keypoint.obj = null;
            }
            cache.current.keypoint.isMoving = false;

            cache.current.hover.position = new paper.Point(0, 0);
            cache.current.hover.keypoint = null;
            cache.current.hover.shape.categoryId = null;
            cache.current.hover.shape.annotationId = null;

            if (cache.current.circle.obj) {
                cache.current.circle.obj.remove();
                cache.current.circle.obj = null;
            }
            if (cache.current.tooltip.text) {
                cache.current.tooltip.text.remove();
                cache.current.tooltip.text = null;
            }
            if (cache.current.tooltip.box) {
                cache.current.tooltip.box.remove();
                cache.current.tooltip.box = null;
            }
        }
    }, [isActive]);

    return {
        settings,
        setTooltipOn,
    };
};
