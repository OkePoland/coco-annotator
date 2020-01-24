/**
 * Tool to select things & Display tooltips
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import paper from 'paper';

import {
    Maybe,
    MouseEvent,
    DataType,
    DataIndicator,
    DataKeypoint,
} from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

import { isIndicator, isAnnotation, isKeypoint } from '../Utils/typeGuards';

// interfaces
interface IToolSelect {
    (
        paperRef: React.MutableRefObject<Maybe<paper.PaperScope>>,
        isActive: boolean,
        scale: number,
    ): ToolSelectResponse;
}
export interface ToolSelectResponse {
    tooltipOn: boolean;
    setTooltipOn: (isOn: boolean) => void;
}
interface Cache {
    point: Maybe<paper.Path.Circle>; // circle shape around selected point
    segment: Maybe<paper.Segment>; // reference to point in some shape
    keypoint: Maybe<DataKeypoint>; // reference for hovered keypoint

    hover: {
        text: Maybe<paper.PointText>; // tooltip text shape
        box: Maybe<paper.Path.Rectangle>; // tooltip background shape
        position: paper.Point; // tooltip position
        textId: number; // id of annotation TEXT has been generated for
        fontSize: number; // fontsize of tooltip
        textShift: number; // shift of tooltip text (based on scale)
        shift: number; // shift of whole tooltip (based on scale)
        rounded: number; // radius of tooltip background ( based on scale)
        categoryId: Maybe<number>; // hovered annotation CategoryId
        annotationId: Maybe<number>; // hovered annotation Id
    };

    edit: {
        center: Maybe<paper.Point>;
        indicatorWidth: number;
        indicatorSize: number;
        canMove: boolean;
    };

    bbox: {
        isBbox: boolean;
        moveObject: Maybe<paper.Item>;
        initPoint: Maybe<paper.Point>;
    };
}
interface Settings {
    tooltipOn: boolean;
}

const hitOptions = {
    segments: true,
    stroke: true,
    fill: false,
    tolerance: CONFIG.TOOLS_SELECT_INITIAL_HIT_TOLERANCE,
    match: (hit: { item: { data: Object } }) => {
        return !isIndicator(hit.item.data);
    },
};

export const useSelect: IToolSelect = (paperRef, isActive, scale) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);
    const cache = useRef<Cache>({
        point: null,
        segment: null,
        keypoint: null,
        hover: {
            text: null,
            box: null,
            position: new paper.Point(0, 0),
            textId: -1,
            textShift: 0,
            fontSize: 3,
            shift: 0,
            rounded: 0,
            categoryId: null,
            annotationId: null,
        },
        edit: {
            center: null,
            indicatorWidth: 0,
            indicatorSize: 0,
            canMove: false,
        },
        bbox: {
            isBbox: false,
            moveObject: null,
            initPoint: null,
        },
    });
    const [settings, _setSettings] = useState<Settings>({
        tooltipOn: CONFIG.TOOLS_SELECT_INITIAL_TOOLTIP_ON,
    });

    // private actions
    const _createPoint = useCallback((point: paper.Point) => {
        if (cache.current.point != null) {
            cache.current.point.remove();
        }
        const pt = new paper.Path.Circle(
            point,
            cache.current.edit.indicatorSize,
        );
        pt.strokeColor = new paper.Color('black');
        pt.strokeWidth = cache.current.edit.indicatorWidth;
        const data: DataIndicator = { type: DataType.INDICATOR };
        pt.data = data;

        cache.current.point = pt;
    }, []);

    const _generateTitle = useCallback(() => {
        let string = ' ';
        if (cache.current.keypoint) {
            let index = cache.current.keypoint.indexLabel;
            let visibility = cache.current.keypoint.visibility;

            string += 'Keypoint \n';
            string += 'Visibility: ' + visibility + ' \n';
            string +=
                index === -1
                    ? 'No Label \n'
                    : 'Label: ' +
                      cache.current.keypoint.keypoints.labels[index - 1] +
                      ' \n';
            return string.replace(/\n/g, ' \n ').slice(0, -2);
        }

        if (
            cache.current.hover.categoryId &&
            cache.current.hover.annotationId
        ) {
            let id = cache.current.hover.textId;
            let category = cache.current.hover.categoryId;
            string += 'ID: ' + id + ' \n';
            string += 'Category: ' + category + ' \n';
        }

        return string.replace(/\n/g, ' \n ').slice(0, -2) + ' \n ';
    }, []);

    const _generateStringFromMetadata = useCallback(() => {
        if (cache.current.keypoint) return '';
        let string = '';

        //let metadata = this.hover.annotation.$refs.metadata.metadataList; // TODO add metadata for project
        let metadata: Array<{ key: string; value: string }> = [];

        if (metadata == null || metadata.length === 0) {
            string += 'No Metadata \n';
        } else {
            string += 'Metadata \n';
            metadata.forEach(element => {
                if (element.key.length !== 0) {
                    string += ' ' + element.key + ' = ' + element.value + ' \n';
                }
            });
        }
        return string.replace(/\n/g, ' \n ').slice(0, -2);
    }, []);

    const _checkBbox = useCallback((item: Maybe<paper.Item>) => {
        if (!item) return false;
        // let annotationId = item.data.annotationId;   // TODO uncomment when bbox select functionlity will be on
        // let categoryId = item.data.categoryId;
        // let category = this.$parent.getCategory(categoryId);
        // let annotation = category.getAnnotation(annotationId);
        // return annotation.annotation.isbbox;
        return false;
    }, []);

    const _clear = useCallback(() => {
        cache.current.hover.categoryId = null;
        cache.current.hover.annotationId = null;

        cache.current.bbox.isBbox = false;
        cache.current.bbox.moveObject = null;

        cache.current.segment = null;

        if (cache.current.hover.text) {
            cache.current.hover.text.remove();
            cache.current.hover.text = null;
        }
        if (cache.current.hover.box) {
            cache.current.hover.box.remove();
            cache.current.hover.box = null;
        }
    }, []);

    const _hoverText = useCallback(() => {
        if (!settings.tooltipOn) return;
        if (!cache.current.keypoint) {
            if (cache.current.hover.categoryId == null) return;
            if (cache.current.hover.annotationId == null) return;
        }

        let position = cache.current.hover.position.add(
            cache.current.hover.textShift,
        );

        if (
            !cache.current.hover.text ||
            cache.current.hover.annotationId !== cache.current.hover.textId ||
            cache.current.keypoint != null
        ) {
            if (cache.current.hover.text) cache.current.hover.text.remove();
            if (cache.current.hover.box) cache.current.hover.box.remove();

            let content = _generateTitle() + _generateStringFromMetadata();
            if (cache.current.hover.annotationId) {
                cache.current.hover.textId =
                    cache.current.hover.annotationId || 0; // TO DO check
            }

            const data: DataIndicator = { type: DataType.INDICATOR };

            const hover = new paper.PointText(position);
            hover.justification = 'left';
            hover.fillColor = new paper.Color('black');
            hover.content = content;
            hover.fontSize = cache.current.hover.fontSize;
            hover.data = data;

            cache.current.hover.text = hover;

            const box = new paper.Path.Rectangle(
                cache.current.hover.text.bounds,
                new paper.Size(
                    cache.current.hover.rounded,
                    cache.current.hover.rounded,
                ),
            );
            box.fillColor = new paper.Color('white');
            box.strokeColor = new paper.Color('white');
            box.opacity = 0.5;
            box.data = data;

            cache.current.hover.box = box;
        }

        cache.current.hover.shift =
            (cache.current.hover.text.bounds.bottomRight.x -
                cache.current.hover.text.bounds.bottomLeft.x) /
            2;

        if (cache.current.hover.box) {
            cache.current.hover.box.position = position.add(
                cache.current.hover.shift,
            );
            cache.current.hover.box.bringToFront();
        }
        if (cache.current.hover.text) {
            cache.current.hover.text.position = position.add(
                cache.current.hover.shift,
            );
            cache.current.hover.text.bringToFront();
        }
    }, [_generateTitle, _generateStringFromMetadata, settings.tooltipOn]);

    const setTooltipOn = useCallback((isOn: boolean) => {
        _setSettings(oldState => ({ ...oldState, tooltipOn: isOn }));
    }, []);

    // mouse events
    const onMouseDown = useCallback(
        (event: MouseEvent) => {
            if (!paperRef.current) return;
            let hitResult = paperRef.current.project.hitTest(
                event.point,
                hitOptions,
            );
            if (!hitResult) return;

            if (event.modifiers && event.modifiers.shift) {
                if (hitResult.type === 'segment') {
                    hitResult.segment.remove();
                }
                return;
            }

            let path = hitResult.item;
            let paperItem: Maybe<paper.Item> = null;
            if (hitResult.type === 'segment') {
                cache.current.segment = hitResult.segment;
                paperItem = path.parent;
            } else if (hitResult.type === 'stroke') {
                let location = hitResult.location;
                if (path instanceof paper.Path) {
                    cache.current.segment = path.insert(
                        location.index + 1,
                        event.point,
                    );
                }
            } else if (event.item.className === 'CompoundPath') {
                cache.current.bbox.initPoint = event.point;
                cache.current.bbox.moveObject = event.item;
                paperItem = event.item;
            }
            cache.current.bbox.isBbox = _checkBbox(paperItem);

            if (cache.current.point) {
                cache.current.edit.canMove = cache.current.point.contains(
                    event.point,
                );
            } else {
                cache.current.edit.canMove = false;
            }
        },
        [paperRef, _checkBbox],
    );

    const onMouseMove = useCallback(
        (event: MouseEvent) => {
            if (!paperRef.current) return;

            let hitResult = paperRef.current.project.hitTest(
                event.point,
                hitOptions,
            );
            const noPoint = () => {
                if (cache.current.point != null) {
                    cache.current.point.remove();
                    cache.current.point = null;
                }
            };

            if (hitResult) {
                let point = null;

                if (hitResult.type === 'segment') {
                    point = hitResult.segment.location.point;
                } else if (hitResult.type === 'stroke') {
                    point = hitResult.location.point;
                }

                if (point != null) {
                    cache.current.edit.center = point;
                    _createPoint(point);
                } else {
                    noPoint();
                }
            } else noPoint();

            // this.$parent.hover.annotation = -1;  // TODO add parent hover values
            // this.$parent.hover.category = -1;    // TODO add parent hover values
            paperRef.current.project.activeLayer.selected = false;

            cache.current.keypoint = null;

            if (event.item && event.item instanceof paper.Group) {
                const groupHit = event.item.hitTest(event.point);
                if (groupHit && isAnnotation(groupHit.item.data)) {
                    const { categoryId, annotationId } = groupHit.item.data;
                    cache.current.hover.position = event.point;
                    cache.current.hover.categoryId = categoryId;
                    cache.current.hover.annotationId = annotationId;
                    // this.hover.category = this.$parent.getCategory(categoryId);  // TODO  getCategory method to project
                    if (cache.current.hover.categoryId != null) {
                        // this.hover.annotation = this.hover.category.getAnnotation(annotationId); // TODO getAnnotation method to project
                        groupHit.item.selected = true;
                        _hoverText();
                    }
                } else if (groupHit && isKeypoint(groupHit.item.data)) {
                    cache.current.hover.position = event.point;
                    let item = groupHit.item.data;
                    cache.current.keypoint = item;
                } else {
                    _clear();
                }
            } else {
                _clear();
            }
        },
        [paperRef, _createPoint, _hoverText, _clear],
    );

    const onMouseDrag = useCallback(
        (event: MouseEvent) => {
            if (
                cache.current.bbox.isBbox &&
                cache.current.bbox.moveObject &&
                cache.current.bbox.initPoint // TODO check when bbox select will be active
            ) {
                let delta_x = cache.current.bbox.initPoint.x - event.point.x;
                let delta_y = cache.current.bbox.initPoint.y - event.point.y;

                let child0 = cache.current.bbox.moveObject.children[0]; // TODO check when bbox select will be active
                if (child0 instanceof paper.Path) {
                    let segments = child0.segments;
                    segments.forEach(segment => {
                        let p = segment.point;
                        segment.point = new paper.Point(
                            p.x - delta_x,
                            p.y - delta_y,
                        );
                    });
                    cache.current.bbox.initPoint = event.point;
                }
            }
            if (cache.current.segment && cache.current.edit.canMove) {
                _createPoint(event.point);
                if (cache.current.bbox.isBbox) {
                    let isCounterClock =
                        cache.current.segment.previous.point.x ===
                        cache.current.segment.point.x;
                    let prev = isCounterClock
                        ? cache.current.segment.previous
                        : cache.current.segment.next;
                    let next = !isCounterClock
                        ? cache.current.segment.previous
                        : cache.current.segment.next;
                    prev.point = new paper.Point(event.point.x, prev.point.y);
                    next.point = new paper.Point(next.point.x, event.point.y);
                }
                cache.current.segment.point = event.point;
            }
        },
        [_createPoint],
    );

    const onMouseUp = useCallback((event: MouseEvent) => _clear(), [_clear]);

    // tool effects
    useEffect(() => {
        if (!toolRef.current) toolRef.current = new paper.Tool();

        toolRef.current.onMouseMove = onMouseMove;
        toolRef.current.onMouseDown = onMouseDown;
        toolRef.current.onMouseDrag = onMouseDrag;
        toolRef.current.onMouseUp = onMouseUp;
    }, [onMouseDown, onMouseDrag, onMouseMove, onMouseUp]);

    useEffect(() => {
        cache.current.hover.rounded = scale * CONFIG.TOOLS_SELECT_SCALE_ROUNDED;
        cache.current.hover.textShift =
            scale * CONFIG.TOOLS_SELECT_SCALE_TEXT_SHIFT;
        cache.current.hover.fontSize =
            scale * CONFIG.TOOLS_SELECT_SCALE_FONTSIZE;

        cache.current.edit.indicatorSize =
            scale * CONFIG.TOOLS_SELECT_SCALE_INDICATOR_SIZE;
        cache.current.edit.indicatorWidth =
            scale * CONFIG.TOOLS_SELECT_SCALE_INDICATOR_WIDTH;

        if (cache.current.edit.center && cache.current.point) {
            _createPoint(cache.current.edit.center);
        }

        if (cache.current.hover.text) {
            cache.current.hover.text.fontSize = cache.current.hover.fontSize;
            cache.current.hover.shift =
                (cache.current.hover.text.bounds.bottomRight.x -
                    cache.current.hover.text.bounds.bottomLeft.x) /
                2;
            let totalShift =
                cache.current.hover.shift + cache.current.hover.textShift;
            cache.current.hover.text.position = cache.current.hover.position.add(
                totalShift,
            );
            if (cache.current.hover.box) {
                cache.current.hover.box.bounds =
                    cache.current.hover.text.bounds;
            }
        }
    }, [scale, _createPoint]);

    useEffect(() => {
        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        } else {
            if (cache.current.hover.text) {
                cache.current.hover.text.remove();
                cache.current.hover.text = null;
            }
            if (cache.current.hover.box) {
                cache.current.hover.box.remove();
                cache.current.hover.box = null;
            }
            if (cache.current.point) {
                cache.current.point.remove();
                cache.current.point = null;
                cache.current.segment = null;
            }
            // if (this.hover.annotation) {
            //      this.hover.annotation.compoundPath.selected = false;    // TODO add method to project
            // }
        }
    }, [isActive]);

    return {
        tooltipOn: settings.tooltipOn,
        setTooltipOn,
    };
};
