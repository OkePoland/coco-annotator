import React from 'react';
import clsx from 'clsx';
import { useNavigation } from 'react-navi';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Tool } from './annotator.types';

import { useStyles } from './annotator.styles';
import {
    useChoices,
    useDataset,
    useInfo,
    useFilter,
    useCursor,
    useShortcuts,
    useKeyPress,
    useModals,
} from './Info';
import { useCanvas, useGroups, useTools, useTitle, Part } from './Paper';

import CustomModal from '../common/components/CustomDialog';
import * as Menu from './Menu';
import * as Panel from './Panel';
import * as Modal from './Modal';

import { createExportObj, findNextSelected } from './Annotator.utils';

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
    const { shortcuts, setShortcuts } = useShortcuts();
    const {
        modalOpen,
        modalState,
        isModalOpen,
        closeAllModals,
        openSettingsModal,
        openCategoryModal,
        openAnnotationModal,
    } = useModals();

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

    // Keyboard actions ( mix of info & groups )
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
    useKeyPress(shortcuts.annotation_add, isModalOpen, async () => {
        const { categoryId } = selected;
        if (categoryId != null) {
            const newItem = await info.creator.create(imageId, categoryId);
            if (newItem) {
                groups.creator.add(categoryId, newItem);
                setSelected(categoryId, newItem.id);
            }
        }
    });
    useKeyPress(shortcuts.annotation_remove, isModalOpen, () => {
        const { categoryId, annotationId } = selected;
        if (categoryId != null && annotationId != null) {
            info.creator.remove(categoryId, annotationId);
            groups.creator.remove(categoryId, annotationId);
            setSelected(categoryId, null);
        }
    });
    useKeyPress(shortcuts.undo, isModalOpen, () => {
        // TODO
    });
    useKeyPress(shortcuts.save, isModalOpen, () => {
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
    });
    useKeyPress(shortcuts.image_center, isModalOpen, () => {
        centerImageAction();
    });
    useKeyPress(shortcuts.image_next, isModalOpen, () => {
        if (next) navigate(`/annotate/${next}`);
    });
    useKeyPress(shortcuts.image_prev, isModalOpen, () => {
        if (previous) navigate(`/annotate/${previous}`);
    });

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
                                info.editor.setCategoriesEnabled(isOn);
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
                    openSettingsAction={openSettingsModal}
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
                            setExpanded={info.editor.setCategoryExpanded}
                            editCategory={() => {
                                openCategoryModal(categoryInfo.id);
                            }}
                            addAnnotation={async (id: number) => {
                                const newItem = await info.creator.create(
                                    imageId,
                                    id,
                                );
                                if (!newItem) return;

                                groups.creator.add(categoryInfo.id, newItem);
                                setSelected(categoryInfo.id, newItem.id);
                            }}
                            renderExpandedList={() =>
                                categoryInfo.annotations.map(annotationInfo => (
                                    <Panel.AnnotationCard
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
                                            setSelected(null, null);
                                            info.creator.remove(
                                                categoryInfo.id,
                                                annotationInfo.id,
                                            );
                                            groups.creator.remove(
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

            <React.Fragment>
                {canvasRef.current &&
                    info.data.map(categoryInfo => (
                        <React.Fragment key={categoryInfo.id}>
                            <Part.CategoryInfo
                                key={categoryInfo.id}
                                id={categoryInfo.id}
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
                                <Part.AnnotationInfo
                                    key={annotationInfo.id}
                                    id={annotationInfo.id}
                                    categoryId={categoryInfo.id}
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
                <CustomModal
                    title="Settings"
                    open={modalOpen.settings}
                    setClose={closeAllModals}
                    renderContent={() => (
                        <Modal.Settings
                            shortcuts={shortcuts}
                            setShortcuts={setShortcuts}
                        />
                    )}
                />
                <CustomModal
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
                <CustomModal
                    title={
                        modalState.annotationId != null
                            ? `Editing Annotation: [${modalState.annotationId}]`
                            : ''
                    }
                    open={modalOpen.annotation}
                    setClose={closeAllModals}
                    renderContent={() => {
                        const { categoryId, annotationId } = modalState;

                        const categoryInfo = info.data.find(
                            o => o.id === categoryId,
                        );
                        if (!categoryInfo) return <CircularProgress />;

                        const annotationInfo = categoryInfo.annotations.find(
                            o => o.id === annotationId,
                        );
                        if (!annotationInfo) return <CircularProgress />;

                        return (
                            <Modal.Annotation
                                className={classes.modal}
                                name={annotationInfo.name}
                                color={annotationInfo.color}
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
                            />
                        );
                    }}
                />
            </React.Fragment>
        </div>
    );
};
export default Annotator;
