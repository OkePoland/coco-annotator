import React from 'react';
import clsx from 'clsx';
import { useNavigation } from 'react-navi';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import { Tool } from './annotator.types';

import * as CONFIG from './annotator.config';

import { useStyles } from './annotator.styles';
import { useChoices, useDataset, useInfo, useFilter, useCursor } from './Info';
import { useCanvas, useGroups, useTools, useTitle, Part } from './Paper';

import * as Menu from './Menu';
import * as Panel from './Panel';

const Annotator: React.FC<{ imageId: number }> = ({ imageId }) => {
    const classes = useStyles();

    const { navigate } = useNavigation();

    // all data & callbacks WITHOUT! Paper.js references
    const {
        segmentMode: [segmentOn, setSegmentOn],
        toolState: [activeTool, toggleTool],
        selected,
        setSelected,
    } = useChoices();

    const { categories, filename, previous, next } = useDataset(imageId);
    const info = useInfo(categories);
    const filter = useFilter(categories);
    const cursor = useCursor(activeTool, selected.annotationId);

    // all Paper.js data & callbacks
    const {
        paperRef,
        canvasRef,
        imageInfo,
        centerImageAction,
        onWheelAction,
    } = useCanvas(`/api/image/${imageId}`);

    const groups = useGroups(categories, selected);

    const tools = useTools(
        paperRef,
        activeTool,
        selected.annotationId,
        imageId,
        imageInfo.scale,
        imageInfo.size,
        imageInfo.data,
        groups.unite,
        groups.subtract,
        groups.simplify,
        () => {
            // TODO addKeypoint
        },
    );

    useTitle(imageInfo.size, filename);

    return (
        <div className={classes.root}>
            <Box className={classes.leftPanel}>
                {segmentOn && (
                    <Box>
                        <Menu.Tools
                            enabled={selected.annotationId != null}
                            activeTool={activeTool}
                            toggleTool={toggleTool}
                        />
                        <Divider className={classes.divider} />
                        <Menu.Annotation
                            annotationAction={() => {}}
                            annotationCopyAction={() => {}}
                            setAnnotationOn={() => {}}
                        />
                        <Divider className={classes.divider} />
                    </Box>
                )}
                <Menu.Utils
                    centerImageAction={centerImageAction}
                    undoAction={() => {}}
                />
                <Divider className={classes.divider} />
                <Menu.Settings
                    segmentOn={segmentOn}
                    setSegmentOn={setSegmentOn}
                    downloadImageAction={() => {}}
                    saveImageAction={() => {}}
                    openImageAction={() => {}}
                    deleteImageAction={() => {}}
                />
            </Box>

            <Box className={classes.rightPanel}>
                <Panel.FileTile
                    className={classes.fileTitle}
                    filename={filename}
                    prevImgId={previous}
                    nextImgId={next}
                    changeImage={id => {
                        navigate(`/annotate/${id}`);
                    }}
                />

                <Divider className={classes.divider} />

                <Box>
                    {categories.length > 0 && (
                        <Panel.SearchInput
                            className={classes.searchInput}
                            value={filter.searchText}
                            setValue={filter.setSearchText}
                        />
                    )}
                    {categories.length > 0 ? (
                        segmentOn ? (
                            info.data.map(categoryInfo => (
                                <Panel.CategoryCard
                                    key={categoryInfo.id}
                                    data={categoryInfo.data}
                                    isVisible={
                                        filter.filteredIds.indexOf(
                                            categoryInfo.id,
                                        ) > -1
                                    }
                                    isSelected={
                                        categoryInfo.id === selected.categoryId
                                    }
                                    isEnabled={categoryInfo.enabled}
                                    isExpanded={categoryInfo.expanded}
                                    setSelected={setSelected}
                                    setEnabled={info.setCategoryEnabled}
                                    setExpanded={info.setCategoryExpanded}
                                    editCategory={(id: number) => {
                                        // TODO
                                    }}
                                    addAnnotation={(id: number) => {
                                        // TODO
                                    }}
                                    renderExpandedList={() =>
                                        categoryInfo.annotations.map(item => (
                                            <Panel.AnnotationCard
                                                key={item.id}
                                                data={item.data}
                                                isSelected={
                                                    item.id ===
                                                    selected.annotationId
                                                }
                                                isEnabled={item.enabled}
                                                edit={() => {}}
                                                remove={() => {
                                                    // TODO
                                                }}
                                                setSelected={() => {
                                                    setSelected(
                                                        categoryInfo.id,
                                                        item.id,
                                                    );
                                                }}
                                                setEnabled={() => {
                                                    info.setAnnotationEnabled(
                                                        categoryInfo.id,
                                                        item.id,
                                                    );
                                                }}
                                            />
                                        ))
                                    }
                                />
                            ))
                        ) : (
                            <Panel.CLabel />
                        )
                    ) : (
                        <Box textAlign="center">
                            No categories have been enabled for this image
                        </Box>
                    )}
                </Box>

                <Divider className={classes.divider} />

                {selected.annotationId != null && (
                    <Box textAlign="center">
                        <Box>{activeTool}</Box>
                        {(() => {
                            switch (activeTool) {
                                case Tool.SELECT:
                                    return (
                                        <Panel.Select
                                            className={classes.bboxPanel}
                                            tooltipOn={tools.select.tooltipOn}
                                            setTooltipOn={
                                                tools.select.setTooltipOn
                                            }
                                        />
                                    );
                                case Tool.BBOX:
                                    return (
                                        <Panel.BBox
                                            className={classes.bboxPanel}
                                            color={tools.bbox.color}
                                            setColor={tools.bbox.setColor}
                                        />
                                    );
                                case Tool.POLYGON:
                                    return (
                                        <Panel.Polygon
                                            className={classes.bboxPanel}
                                            guidanceOn={
                                                tools.polygon.guidanceOn
                                            }
                                            strokeColor={
                                                tools.polygon.strokeColor
                                            }
                                            minDistance={
                                                tools.polygon.minDistance
                                            }
                                            completeDistance={
                                                tools.polygon.completeDistance
                                            }
                                            setGuidanceOn={
                                                tools.polygon.setGuidanceOn
                                            }
                                            setStrokeColor={
                                                tools.polygon.setStrokeColor
                                            }
                                            setMinDistance={
                                                tools.polygon.setMinDistance
                                            }
                                            setCompleteDistance={
                                                tools.polygon
                                                    .setCompleteDistance
                                            }
                                        />
                                    );
                                case Tool.WAND:
                                    return (
                                        <Panel.Wand
                                            className={classes.bboxPanel}
                                            threshold={tools.wand.threshold}
                                            blur={tools.wand.blur}
                                            setThreshold={
                                                tools.wand.setThreshold
                                            }
                                            setBlur={tools.wand.setBlur}
                                        />
                                    );
                                case Tool.BRUSH:
                                    return (
                                        <Panel.Brush
                                            className={classes.bboxPanel}
                                            radius={tools.brush.radius}
                                            color={tools.brush.color}
                                            setColor={tools.brush.setColor}
                                            setRadius={tools.brush.setRadius}
                                        />
                                    );
                                case Tool.ERASER:
                                    return (
                                        <Panel.Brush
                                            className={classes.bboxPanel}
                                            radius={tools.eraser.radius}
                                            color={tools.eraser.color}
                                            setColor={tools.eraser.setColor}
                                            setRadius={tools.eraser.setRadius}
                                        />
                                    );
                                case Tool.KEYPOINT:
                                    return <Panel.Keypoints />;
                                case Tool.DEXTR:
                                    return (
                                        <Panel.Dextr
                                            className={classes.bboxPanel}
                                            padding={tools.dextr.padding}
                                            threshold={tools.dextr.threshold}
                                            setPadding={tools.dextr.setPadding}
                                            setThreshold={
                                                tools.dextr.setThreshold
                                            }
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })()}
                    </Box>
                )}

                {CONFIG.DEBUGGING_ON && paperRef.current != null && (
                    <div style={{ height: 700, overflow: 'auto' }}>
                        <pre>
                            {JSON.stringify(
                                paperRef.current.project.layers[0].children.filter(
                                    o => o.data.hasOwnProperty('categoryId'),
                                ),
                                null,
                                2,
                            )}
                        </pre>
                    </div>
                )}
            </Box>

            <div className={clsx(classes.middlePanel, cursor)}>
                <div className={classes.frame} onWheel={onWheelAction}>
                    <canvas
                        ref={canvasRef}
                        className={classes.canvas}
                        // !! very very important paper.js attribute for resize magic !!
                        data-paper-resize
                    />
                </div>
            </div>

            {canvasRef.current != null && (
                <div>
                    {info.data.map(categoryInfo => (
                        <React.Fragment key={categoryInfo.id}>
                            <Part.CategoryInfo
                                key={categoryInfo.id}
                                id={categoryInfo.id}
                                enabled={categoryInfo.enabled}
                                color={
                                    categoryInfo.enabled &&
                                    !categoryInfo.expanded
                                        ? categoryInfo.data.color
                                        : null
                                }
                                groupsRef={groups.groupsRef}
                            />
                            {categoryInfo.annotations.map(annotationInfo => (
                                <Part.AnnotationInfo
                                    key={annotationInfo.id}
                                    id={annotationInfo.id}
                                    categoryId={categoryInfo.id}
                                    enabled={annotationInfo.enabled}
                                    color={
                                        categoryInfo.enabled &&
                                        categoryInfo.expanded
                                            ? annotationInfo.data.color
                                            : null
                                    }
                                    isSelected={
                                        annotationInfo.id ===
                                        selected.annotationId
                                    }
                                    groupsRef={groups.groupsRef}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Annotator;
