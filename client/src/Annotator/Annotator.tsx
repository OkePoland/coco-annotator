import React from 'react';
import clsx from 'clsx';
import { useNavigation } from 'react-navi';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Tool } from './annotator.types';

import * as CONFIG from './annotator.config';

import { useStyles } from './annotator.styles';
import { useChoices, useDataset, useInfo, useFilter, useCursor } from './Info';
import { useCanvas, useGroups, useTools, useTitle, Part } from './Paper';

import * as Menu from './Menu';
import * as Panel from './Panel';

import { createExportObj } from './Annotator.utils';

const Annotator: React.FC<{ imageId: number }> = ({ imageId }) => {
    const classes = useStyles();

    const { navigate } = useNavigation();

    // all data & callbacks WITHOUT! Paper.js references
    const {
        dataset,
        categories,
        filename,
        previous,
        next,
        isLoading,
        toolPreferences,
        saveAction,
    } = useDataset(imageId);
    const {
        segmentMode: [segmentOn, setSegmentOn],
        toolState: [activeTool, toggleTool],
        selected,
        setSelected,
    } = useChoices();

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
        toolPreferences,
        activeTool,
        selected.annotationId,
        imageId,
        imageInfo.scale,
        imageInfo.size,
        imageInfo.data,
        groups.shape.unite,
        groups.shape.subtract,
        groups.shape.simplify,
        groups.shape.uniteBBOX,
        groups.keypoints.add,
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
                            setCategoriesEnabled={(isOn: boolean) => {
                                info.enabler.setCategoriesEnabled(isOn);
                                setSelected(null, null);
                            }}
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
                    saveImageAction={() => {
                        const obj = createExportObj(
                            imageId,
                            dataset,
                            segmentOn,
                            activeTool,
                            selected,
                            tools.exportData,
                            info.data,
                            groups.groupsRef.current,
                        );
                        saveAction(obj);
                    }}
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

                {info.data.length > 1 && (
                    <Panel.SearchInput
                        className={classes.searchInput}
                        value={filter.searchText}
                        setValue={filter.setSearchText}
                    />
                )}

                {segmentOn &&
                    info.data.map(categoryInfo => (
                        <Panel.CategoryCard
                            key={categoryInfo.id}
                            data={categoryInfo.data}
                            isVisible={
                                filter.filterObj[categoryInfo.id] != null
                            }
                            isSelected={categoryInfo.id === selected.categoryId}
                            isEnabled={categoryInfo.enabled}
                            isExpanded={categoryInfo.expanded}
                            annotationCount={categoryInfo.annotations.length}
                            setSelected={() => {
                                setSelected(categoryInfo.id, null);
                            }}
                            setEnabled={info.enabler.setCategoryEnabled}
                            setExpanded={info.enabler.setCategoryExpanded}
                            editCategory={(id: number) => {
                                // TODO
                            }}
                            addAnnotation={async (id: number) => {
                                const newItem = await info.creator.create(
                                    imageId,
                                    id,
                                );
                                if (newItem) {
                                    groups.creator.add(
                                        categoryInfo.id,
                                        newItem,
                                    );
                                    setSelected(categoryInfo.id, newItem.id);
                                }
                            }}
                            renderExpandedList={() =>
                                categoryInfo.annotations.map(item => (
                                    <Panel.AnnotationCard
                                        key={item.id}
                                        data={item.data}
                                        isSelected={
                                            item.id === selected.annotationId
                                        }
                                        isEnabled={item.enabled}
                                        edit={() => {
                                            // TODO
                                        }}
                                        remove={() => {
                                            setSelected(null, null);
                                            info.creator.remove(
                                                categoryInfo.id,
                                                item.id,
                                            );
                                            groups.creator.remove(
                                                categoryInfo.id,
                                                item.id,
                                            );
                                        }}
                                        setSelected={() => {
                                            setSelected(
                                                categoryInfo.id,
                                                item.id,
                                            );
                                        }}
                                        setEnabled={() => {
                                            info.enabler.setAnnotationEnabled(
                                                categoryInfo.id,
                                                item.id,
                                            );
                                        }}
                                    />
                                ))
                            }
                        />
                    ))}

                {info.data.length === 0 && (
                    <Box textAlign="center">
                        <CircularProgress />
                        {!isLoading && categories.length === 0 && (
                            <div>
                                No categories have been enabled for this image
                            </div>
                        )}
                    </Box>
                )}

                {!segmentOn && <Panel.CLabel />}

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
                                            tooltipOn={
                                                tools.select.settings.tooltipOn
                                            }
                                            setTooltipOn={
                                                tools.select.setTooltipOn
                                            }
                                        />
                                    );
                                case Tool.BBOX:
                                    return (
                                        <Panel.BBox
                                            className={classes.bboxPanel}
                                            color={tools.bbox.settings.color}
                                            setColor={tools.bbox.setColor}
                                        />
                                    );
                                case Tool.POLYGON:
                                    return (
                                        <Panel.Polygon
                                            className={classes.bboxPanel}
                                            guidanceOn={
                                                tools.polygon.settings
                                                    .guidanceOn
                                            }
                                            strokeColor={
                                                tools.polygon.settings
                                                    .strokeColor
                                            }
                                            minDistance={
                                                tools.polygon.settings
                                                    .minDistance
                                            }
                                            completeDistance={
                                                tools.polygon.settings
                                                    .completeDistance
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
                                            threshold={
                                                tools.wand.settings.threshold
                                            }
                                            blur={tools.wand.settings.blur}
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
                                            radius={tools.brush.settings.radius}
                                            color={tools.brush.settings.color}
                                            setColor={tools.brush.setColor}
                                            setRadius={tools.brush.setRadius}
                                        />
                                    );
                                case Tool.ERASER:
                                    return (
                                        <Panel.Brush
                                            className={classes.bboxPanel}
                                            radius={
                                                tools.eraser.settings.radius
                                            }
                                            color={tools.eraser.settings.color}
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

            {canvasRef.current != null &&
                info.data.map(categoryInfo => (
                    <React.Fragment key={categoryInfo.id}>
                        <Part.CategoryInfo
                            key={categoryInfo.id}
                            id={categoryInfo.id}
                            enabled={categoryInfo.enabled}
                            color={
                                categoryInfo.enabled && !categoryInfo.expanded
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
                                    annotationInfo.id === selected.annotationId
                                }
                                groupsRef={groups.groupsRef}
                            />
                        ))}
                    </React.Fragment>
                ))}
        </div>
    );
};
export default Annotator;
