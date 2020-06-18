import React, { useMemo, useCallback } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
    AnnotatorProps,
    Tool,
    ToolEvent,
    UndoItemType,
    UndoItemShape,
    UndoItemTool,
} from './app.types';

import * as CONFIG from './app.config';
import * as AnnotatorApi from './app.api';
import { useStyles } from './app.styles';

import {
    useChoices,
    useDataset,
    useInfo,
    useFilter,
    useCursor,
    useShortcuts,
    useKeyPress,
    useModals,
} from './Metadata';
import {
    useCanvas,
    useGroups,
    useTools,
    useTitle,
    useUndoStash,
    CategoryGroupComponent,
    AnnotationGroupComponent,
} from './Paper';

import * as ToolBar from './Components/ToolBar';
import * as CategoriesCont from './Components/CategoriesCont';
import * as DetailsCont from './Components/DetailsCont';
import * as Modal from './Components/Modal';

import {
    createExportObj,
    findNextSelected,
    isUndoItemShape,
    isUndoItemTool,
    getTooltipMetadata,
} from './app.utils';

const App: React.FC<AnnotatorProps> = ({
    imageId,
    navigate,
    showDialogMsg,
    themeObj = CONFIG.DEFAULT_THEME,
}) => {
    const classes = useStyles(themeObj);

    const {
        dataset,
        categories,
        filename,
        previous,
        next,
        initSettings,
        saveDataset,
        copyAnnotations,
    } = useDataset(imageId, showDialogMsg);
    const {
        segmentMode: [segmentOn, setSegmentOn],
        toolState: [activeTool, setTool],
        selected,
        setSelected,
    } = useChoices();

    const info = useInfo(categories);
    const filter = useFilter(categories);
    const cursor = useCursor(activeTool, selected.annotationId);
    const { shortcuts, setShortcuts, restoreDefaultShortcuts } = useShortcuts(
        initSettings.shortcuts,
    );
    const {
        modalOpen,
        modalState,
        isModalOpen,
        closeAllModals,
        openSettingsModal,
        openCategoryModal,
        openAnnotationModal,
        openCopyModal,
    } = useModals();
    const undoStash = useUndoStash();
    const tooltipMetadata = useMemo(() => getTooltipMetadata(info.data), [
        info.data,
    ]);

    // all Paper.js data & callbacks
    const {
        paperRef,
        canvasRef,
        imageInfo,
        centerImageAction,
        onWheelAction,
    } = useCanvas(`/api/image/${imageId}`);

    const groups = useGroups(categories, selected);

    const stashShape = useCallback(() => {
        const { categoryId, annotationId } = selected;
        if (categoryId === null || annotationId === null) return;
        if (categoryId === undefined || annotationId === undefined) return;

        const paperItem = groups.shapeEditor.getPaperItem(
            categoryId,
            annotationId,
        );
        if (!paperItem) return;

        const item: UndoItemShape = {
            type: UndoItemType.SHAPE_CHANGED,
            dispatch: { categoryId, annotationId, paperItem },
        };
        undoStash.add(item);
    }, [selected, undoStash, groups.shapeEditor]);

    const stashToolEvent = useCallback(
        (toolEvent: ToolEvent) => {
            const item: UndoItemTool = {
                type: UndoItemType.TOOL_CHANGED,
                dispatch: { toolEvent },
            };
            undoStash.add(item);
        },
        [undoStash],
    );

    const tools = useTools(
        paperRef,
        initSettings.tools,
        activeTool,
        selected.annotationId,
        imageId,
        imageInfo.scale,
        imageInfo.size,
        imageInfo.data,
        tooltipMetadata,
        (toAdd, isUndoable) => {
            if (isUndoable) stashShape();
            groups.shapeEditor.unite(toAdd);
        },
        (toRemove, isUndoable) => {
            if (isUndoable) stashShape();
            groups.shapeEditor.subtract(toRemove);
        },
        (toAdd, isUndoable) => {
            if (isUndoable) stashShape();
            groups.shapeEditor.uniteBBOX(toAdd);
        },
        groups.shapeEditor.simplify,
        groups.keypointsEditor.add,
        stashToolEvent,
    );
    useTitle(imageInfo.size, filename);

    // re-usable complex callbacks
    const saveAction = useCallback(async () => {
        undoStash.clear();
        const obj = createExportObj(
            imageId,
            dataset,
            segmentOn,
            activeTool,
            selected,
            shortcuts,
            tools.exportData,
            info.data,
            groups.groupsRef.current,
        );
        await saveDataset(obj);
    }, [
        undoStash,
        imageId,
        dataset,
        segmentOn,
        activeTool,
        selected,
        shortcuts,
        groups.groupsRef,
        tools.exportData,
        info.data,
        saveDataset,
    ]);
    const addAnnotationAction = useCallback(
        async (categoryId: number) => {
            const newItem = await info.creator.create(imageId, categoryId);
            if (!newItem) return;

            groups.creator.add(categoryId, newItem);
            setSelected(categoryId, newItem.id);
        },
        [imageId, info.creator, groups.creator, setSelected],
    );
    const removeAnnotationAction = useCallback(
        (categoryId: number, annotationId: number) => {
            const isOk = window.confirm('Remove Annotation ?');
            if (!isOk) return;

            info.creator.remove(categoryId, annotationId);
            groups.creator.remove(categoryId, annotationId);
            setSelected(categoryId, null);
        },
        [info.creator, groups.creator, setSelected],
    );
    const undoAction = useCallback(() => {
        const undoItem = undoStash.pop();
        if (!undoItem) return;

        if (isUndoItemShape(undoItem)) {
            const { categoryId, annotationId, paperItem } = undoItem.dispatch;
            groups.shapeEditor.replacePaperItem(
                categoryId,
                annotationId,
                paperItem,
            );
        } else if (isUndoItemTool(undoItem)) {
            const { toolEvent } = undoItem.dispatch;
            if (toolEvent === ToolEvent.POLYGON_ADD_POINT) {
                tools.polygon.undoLastPoint();
            }
        }
    }, [undoStash, groups.shapeEditor, tools.polygon]);

    const downloadCocoAction = useCallback(async () => {
        await saveAction();

        const url = `/api/image/${imageId}?asAttachment=true`;
        AnnotatorApi.downloadURI(url, filename);

        const data = await AnnotatorApi.downloadCoco(imageId);
        const dataUrl =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(data));
        const fileName2 = filename.replace(/\.[^/.]+$/, '') + '.json';
        AnnotatorApi.downloadURI(dataUrl, fileName2);
    }, [imageId, filename, saveAction]);

    const copyAction = useCallback(
        async (id: number, categoriesIds: number[]) => {
            closeAllModals();
            await saveAction();
            await copyAnnotations({ imageId, id, categoriesIds });
        },
        [imageId, saveAction, copyAnnotations, closeAllModals],
    );

    // keyboard actions ( mix of info & groups )
    useKeyPress(shortcuts.list_move_up, isModalOpen, () => {
        const item = findNextSelected(info.data, selected, -1);
        setSelected(item.categoryId, item.annotationId);
    });
    useKeyPress(shortcuts.list_move_down, isModalOpen, () => {
        const item = findNextSelected(info.data, selected, 1);
        setSelected(item.categoryId, item.annotationId);
    });
    useKeyPress(shortcuts.list_expand, isModalOpen, () => {
        const { categoryId, annotationId } = selected;
        if (categoryId != null && annotationId === null) {
            info.editor.setCategoryExpanded(categoryId, true);
            setSelected(categoryId, null);
        }
    });
    useKeyPress(shortcuts.list_collapse, isModalOpen, () => {
        const { categoryId } = selected;
        if (categoryId != null) {
            info.editor.setCategoryExpanded(categoryId, false);
            setSelected(categoryId, null);
        }
    });
    useKeyPress(shortcuts.annotation_add, isModalOpen, () => {
        const { categoryId } = selected;
        if (categoryId != null) addAnnotationAction(categoryId);
    });
    useKeyPress(shortcuts.annotation_remove, isModalOpen, () => {
        const { categoryId, annotationId } = selected;
        if (categoryId != null && annotationId != null) {
            removeAnnotationAction(categoryId, annotationId);
        }
    });
    useKeyPress(shortcuts.undo, isModalOpen, undoAction);
    useKeyPress(shortcuts.save, isModalOpen, saveAction);
    useKeyPress(shortcuts.image_center, isModalOpen, centerImageAction);
    useKeyPress(shortcuts.image_next, isModalOpen, () => {
        if (next && navigate) navigate(`/annotate/${next}`);
    });
    useKeyPress(shortcuts.image_prev, isModalOpen, () => {
        if (previous && navigate) navigate(`/annotate/${previous}`);
    });
    useKeyPress(shortcuts.tool_select, isModalOpen, () => setTool(Tool.SELECT));
    useKeyPress(shortcuts.tool_bbox, isModalOpen, () => setTool(Tool.BBOX));
    useKeyPress(shortcuts.tool_polygon, isModalOpen, () =>
        setTool(Tool.POLYGON),
    );
    useKeyPress(shortcuts.tool_wand, isModalOpen, () => setTool(Tool.WAND));
    useKeyPress(shortcuts.tool_brush, isModalOpen, () => setTool(Tool.BRUSH));
    useKeyPress(shortcuts.tool_eraser, isModalOpen, () => setTool(Tool.ERASER));
    useKeyPress(shortcuts.tool_keypoint, isModalOpen, () =>
        setTool(Tool.KEYPOINT),
    );
    useKeyPress(shortcuts.tool_dextr, isModalOpen, () => setTool(Tool.DEXTR));
    useKeyPress(shortcuts.brush_decrease, isModalOpen, () => {
        tools.brush.setRadius(tools.brush.settings.radius - 1);
        tools.eraser.setRadius(tools.eraser.settings.radius - 1);
    });
    useKeyPress(shortcuts.brush_increase, isModalOpen, () => {
        tools.brush.setRadius(tools.brush.settings.radius + 1);
        tools.eraser.setRadius(tools.eraser.settings.radius + 1);
    });
    useKeyPress(shortcuts.polygon_close, isModalOpen, () => {
        if (activeTool === Tool.POLYGON) tools.polygon.closePath();
    });

    return (
        <div className={classes.root}>
            <Box className={classes.leftPanel}>
                {segmentOn && (
                    <Box>
                        <ToolBar.Tools
                            enabled={selected.annotationId != null}
                            activeTool={activeTool}
                            setTool={setTool}
                        />
                        <Divider className={classes.divider} />
                        <ToolBar.Annotation
                            annotationAction={() => {}}
                            annotationCopyAction={openCopyModal}
                            setCategoriesEnabled={(isOn: boolean) => {
                                info.editor.setCategoriesEnabled(isOn);
                                setSelected(null, null);
                            }}
                        />
                        <Divider className={classes.divider} />
                        <ToolBar.Utils
                            undoList={undoStash.list}
                            centerImageAction={centerImageAction}
                            undoAction={undoAction}
                        />
                        <Divider className={classes.divider} />
                    </Box>
                )}
                <ToolBar.Settings
                    segmentOn={segmentOn}
                    setSegmentOn={setSegmentOn}
                    downloadImageAction={downloadCocoAction}
                    saveImageAction={saveAction}
                    openSettingsAction={openSettingsModal}
                    deleteImageAction={() => {}}
                />
            </Box>

            <Box className={classes.rightPanel}>
                <CategoriesCont.FileTile
                    className={classes.fileTitle}
                    filename={filename}
                    prevImgId={previous}
                    nextImgId={next}
                    changeImage={id => {
                        if (navigate) navigate(`/annotate/${id}`);
                    }}
                />

                <Divider className={classes.divider} />

                {info.data.length > 1 && (
                    <CategoriesCont.SearchInput
                        className={classes.searchInput}
                        value={filter.searchText}
                        setValue={filter.setSearchText}
                    />
                )}

                {segmentOn &&
                    info.data.map(categoryInfo => (
                        <CategoriesCont.CategoryCard
                            key={categoryInfo.id}
                            id={categoryInfo.id}
                            name={categoryInfo.name}
                            color={categoryInfo.color}
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
                            setEnabled={info.editor.setCategoryEnabled}
                            setExpanded={() => {
                                info.editor.setCategoryExpanded(
                                    categoryInfo.id,
                                );
                                if (categoryInfo.expanded)
                                    setSelected(categoryInfo.id, null);
                            }}
                            editCategory={() => {
                                openCategoryModal(categoryInfo.id);
                            }}
                            addAnnotation={(categoryId: number) => {
                                if (categoryId != null)
                                    addAnnotationAction(categoryId);
                            }}
                            renderExpandedList={() =>
                                categoryInfo.annotations.map(annotationInfo => (
                                    <CategoriesCont.AnnotationCard
                                        key={annotationInfo.id}
                                        id={annotationInfo.id}
                                        name={annotationInfo.name}
                                        color={annotationInfo.color}
                                        isSelected={
                                            annotationInfo.id ===
                                            selected.annotationId
                                        }
                                        isEnabled={annotationInfo.enabled}
                                        edit={() => {
                                            openAnnotationModal(
                                                categoryInfo.id,
                                                annotationInfo.id,
                                            );
                                        }}
                                        remove={() => {
                                            removeAnnotationAction(
                                                categoryInfo.id,
                                                annotationInfo.id,
                                            );
                                        }}
                                        setSelected={() => {
                                            setSelected(
                                                categoryInfo.id,
                                                annotationInfo.id,
                                            );
                                        }}
                                        setEnabled={() => {
                                            info.editor.setAnnotationEnabled(
                                                categoryInfo.id,
                                                annotationInfo.id,
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
                    </Box>
                )}

                <Divider className={classes.divider} />

                {segmentOn && selected.annotationId != null && (
                    <Box textAlign="center">
                        {(() => {
                            switch (activeTool) {
                                case Tool.SELECT:
                                    return (
                                        <DetailsCont.Select
                                            className={classes.toolPanel}
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
                                        <DetailsCont.BBoxPanel
                                            className={classes.toolPanel}
                                            color={tools.bbox.settings.color}
                                            setColor={tools.bbox.setColor}
                                        />
                                    );
                                case Tool.POLYGON:
                                    return (
                                        <DetailsCont.Polygon
                                            className={classes.toolPanel}
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
                                        <DetailsCont.Wand
                                            className={classes.toolPanel}
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
                                        <DetailsCont.Brush
                                            className={classes.toolPanel}
                                            radius={tools.brush.settings.radius}
                                            color={tools.brush.settings.color}
                                            setColor={tools.brush.setColor}
                                            setRadius={tools.brush.setRadius}
                                        />
                                    );
                                case Tool.ERASER:
                                    return (
                                        <DetailsCont.Brush
                                            className={classes.toolPanel}
                                            radius={
                                                tools.eraser.settings.radius
                                            }
                                            color={tools.eraser.settings.color}
                                            setColor={tools.eraser.setColor}
                                            setRadius={tools.eraser.setRadius}
                                        />
                                    );
                                case Tool.KEYPOINT:
                                    return <DetailsCont.Keypoints />;
                                case Tool.DEXTR:
                                    return (
                                        <DetailsCont.Dextr
                                            className={classes.toolPanel}
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

            <React.Fragment key={groups.generation}>
                {canvasRef.current &&
                    info.data.map(categoryInfo => (
                        <React.Fragment key={categoryInfo.id}>
                            <CategoryGroupComponent
                                key={categoryInfo.id}
                                categoryId={categoryInfo.id}
                                enabled={categoryInfo.enabled}
                                color={
                                    categoryInfo.enabled &&
                                    !categoryInfo.expanded
                                        ? categoryInfo.color
                                        : null
                                }
                                groupsRef={groups.groupsRef}
                            />
                            {categoryInfo.annotations.map(annotationInfo => (
                                <AnnotationGroupComponent
                                    key={annotationInfo.id}
                                    categoryId={categoryInfo.id}
                                    annotationId={annotationInfo.id}
                                    enabled={annotationInfo.enabled}
                                    color={
                                        categoryInfo.enabled &&
                                        categoryInfo.expanded
                                            ? annotationInfo.color
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
            </React.Fragment>

            <React.Fragment>
                <Modal.Wrapper
                    title="Settings"
                    open={modalOpen.settings}
                    setClose={closeAllModals}
                    renderContent={() => {
                        if (!modalOpen.settings) return <div />;
                        return (
                            <Modal.Settings
                                shortcuts={shortcuts}
                                setShortcuts={setShortcuts}
                                restoreDefaultShortcuts={
                                    restoreDefaultShortcuts
                                }
                            />
                        );
                    }}
                />
                <Modal.Wrapper
                    title={
                        modalState.categoryId != null
                            ? `Editing Category: [${modalState.categoryId}]`
                            : ''
                    }
                    open={modalOpen.category}
                    setClose={closeAllModals}
                    renderContent={() => {
                        if (!modalOpen.category) return <div />;

                        const categoryInfo = info.data.find(
                            o => o.id === modalState.categoryId,
                        );
                        if (!categoryInfo) return <div />;

                        return (
                            <Modal.Category
                                className={classes.modal}
                                name={categoryInfo.name}
                                color={categoryInfo.color}
                                setColor={(color: string) => {
                                    info.editor.setCategoryColor(
                                        categoryInfo.id,
                                        color,
                                    );
                                }}
                            />
                        );
                    }}
                />
                <Modal.Wrapper
                    title={
                        modalState.annotationId != null
                            ? `Editing Annotation: [${modalState.annotationId}]`
                            : ''
                    }
                    open={modalOpen.annotation}
                    setClose={closeAllModals}
                    renderContent={() => {
                        if (!modalOpen.annotation) return <div />;

                        const { categoryId, annotationId } = modalState;

                        const categoryInfo = info.data.find(
                            o => o.id === categoryId,
                        );
                        if (!categoryInfo) return <div />;

                        const annotationInfo = categoryInfo.annotations.find(
                            o => o.id === annotationId,
                        );
                        if (!annotationInfo) return <div />;

                        return (
                            <Modal.Annotation
                                className={classes.modal}
                                name={annotationInfo.name}
                                color={annotationInfo.color}
                                metadata={annotationInfo.metadata}
                                setName={(newName: string) => {
                                    info.editor.setAnnotationName(
                                        categoryInfo.id,
                                        annotationInfo.id,
                                        newName,
                                    );
                                }}
                                setColor={(color: string) => {
                                    info.editor.setAnnotationColor(
                                        categoryInfo.id,
                                        annotationInfo.id,
                                        color,
                                    );
                                }}
                                addMetadata={() => {
                                    info.editor.addAnnotationMetadata(
                                        categoryInfo.id,
                                        annotationInfo.id,
                                    );
                                }}
                                editMetdata={(index, item) => {
                                    info.editor.editAnnotationMetadata({
                                        categoryId: categoryInfo.id,
                                        annotationId: annotationInfo.id,
                                        index,
                                        obj: item,
                                    });
                                }}
                            />
                        );
                    }}
                />
                <Modal.Wrapper
                    title="Copy annotations from Image"
                    open={modalOpen.copy}
                    setClose={closeAllModals}
                    renderContent={() => {
                        if (!modalOpen.copy) return <div />;

                        return (
                            <Modal.Copy
                                infoData={info.data}
                                onSave={copyAction}
                            />
                        );
                    }}
                />
            </React.Fragment>
        </div>
    );
};

export default App;
