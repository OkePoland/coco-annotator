import React from 'react';
import clsx from 'clsx';
import { useNavigation } from 'react-navi';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import { Tool } from './annotator.types';

import { useStyles } from './annotator.styles';
import { useChoices, useFetch, useInfo, useFilter, useCursor } from './Info';
import { useCanvas, useGroups, useTools, useTitle } from './Paper';

import * as Menu from './Menu';
import * as Panel from './Panel';
import { Part } from './Paper';

const Annotator: React.FC<{ imageId: number }> = ({ imageId }) => {
    const classes = useStyles();

    const { navigate } = useNavigation();

    // all data & callbacks WITHOUT! Paper.js references
    const {
        annotateMode: [annotateOn],
        segmentMode: [segmentOn, setSegmentOn],
        toolState: [activeTool, toggleTool],
        selected,
        setSelected,
    } = useChoices();

    const { categories, filename, previous, next } = useFetch(imageId);
    const info = useInfo(categories);
    const filter = useFilter(categories);
    const cursor = useCursor(activeTool);

    // all Paper.js data & callbacks
    const {
        canvasRef,
        imageData,
        centerImageAction,
        onWheelAction,
    } = useCanvas(`/api/image/${imageId}`);

    const groups = useGroups(categories, selected);

    const tools = useTools(
        activeTool,
        selected.annotation,
        groups.unite,
        groups.subtract,
    );

    useTitle(imageData.rasterSize, filename);

    return (
        <div className={classes.root}>
            <Box className={classes.leftPanel}>
                {segmentOn && (
                    <Box>
                        <Menu.Tools
                            enabled={annotateOn}
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
                            info.data.map(g => (
                                <Panel.CategoryCard
                                    key={g.id}
                                    data={g.data}
                                    isVisible={
                                        filter.filteredIds.indexOf(g.id) > -1
                                    }
                                    isSelected={g.id === selected.category}
                                    isEnabled={g.enabled}
                                    isExpanded={g.expanded}
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
                                        g.annotations.map(item => (
                                            <Panel.AnnotationCard
                                                key={item.id}
                                                data={item.data}
                                                isSelected={
                                                    item.id ===
                                                    selected.annotation
                                                }
                                                isEnabled={item.enabled}
                                                edit={() => {}}
                                                remove={() => {
                                                    // TODO
                                                }}
                                                setSelected={() => {
                                                    setSelected(g.id, item.id);
                                                }}
                                                setEnabled={() => {
                                                    info.setAnnotationEnabled(
                                                        g.id,
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

                <Box textAlign="center">
                    <Box>{activeTool}</Box>
                    {(() => {
                        switch (activeTool) {
                            case Tool.SELECT:
                                return <Panel.Select />;
                            case Tool.BBOX:
                                return (
                                    <Panel.BBox
                                        className={classes.bboxPanel}
                                        color={tools.bbox.color}
                                        setColor={tools.bbox.setColor}
                                    />
                                );
                            case Tool.POLYGON:
                                return <Panel.Polygon />;
                            case Tool.WAND:
                                return <Panel.MagicWand />;
                            case Tool.BRUSH:
                                return <Panel.Brush />;
                            case Tool.ERASER:
                                return (
                                    <Panel.Eraser
                                        className={classes.bboxPanel}
                                        radius={tools.eraser.radius}
                                        color={tools.eraser.color}
                                        setColor={tools.eraser.setColor}
                                        setRadius={tools.eraser.setRadius}
                                    />
                                );
                            case Tool.KEYPOINTS:
                                return <Panel.Keypoints />;
                            case Tool.DEXTR:
                                return <Panel.Dextr />;
                            default:
                                return null;
                        }
                    })()}
                </Box>

                {/* For debugging purpose // TODO remove in final version */}
                {/* {paperRef.current != null && (
                    <div style={{ height: 700, overflow: 'auto' }}>
                        <pre>
                            {JSON.stringify(
                                paperRef.current.project.layers[0].children,
                                null,
                                2,
                            )}
                        </pre>
                    </div>
                )} */}
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
                                        selected.annotation
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
