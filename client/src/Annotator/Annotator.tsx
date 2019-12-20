import React from 'react';
import { useNavigation } from 'react-navi';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import { Annotation } from '../common/types';
import * as CONFIG from './annotator.config';

import { useStyles } from './annotator.styles';
import {
    useUserChoices,
    useData,
    useCategoryData,
    useAnnotationData,
    useCanvas,
    usePainter,
} from './annotator.hooks';

import * as Menu from './Menu';
import * as Panel from './Panel';

const Annotator: React.FC<{ imageId: number }> = ({ imageId }) => {
    const classes = useStyles();

    const { navigate } = useNavigation();

    const {
        annotateMode: [annotateOn],
        segmentMode: [segmentOn, setSegmentOn],
        toolState: [activeTool, toggleTool],
    } = useUserChoices();

    const {
        canvasRef,
        imageData,
        centerImageAction,
        onWheelAction,
    } = useCanvas(`/api/image/${imageId}`);

    const { filename, previous, next, categories } = useData(imageId);

    const categoryData = useCategoryData(categories);

    const annotationData = useAnnotationData();

    usePainter(imageData.rasterSize, filename);

    return (
        <div className={classes.root}>
            <Box className={classes.leftPanel}>
                {segmentOn && (
                    <>
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
                    </>
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
                            value={categoryData.searchText}
                            setValue={categoryData.setSearchText}
                        />
                    )}
                    {categories.length > 0 ? (
                        segmentOn ? (
                            categoryData.filteredList.map(cat => (
                                <Panel.CategoryCard
                                    key={cat.id}
                                    data={cat}
                                    isActive={categoryData.activeId === cat.id}
                                    isEnable={
                                        categoryData.enableIds.indexOf(cat.id) >
                                        -1
                                    }
                                    isExpand={
                                        categoryData.expandIds.indexOf(cat.id) >
                                        -1
                                    }
                                    setActiveId={categoryData.setActiveId}
                                    setEnableId={categoryData.setEnableId}
                                    setExpandId={categoryData.setExpandId}
                                    editCategory={(id: number) => {
                                        // TODO
                                    }}
                                    addAnnotation={(id: number) => {
                                        annotationData.add(imageId, id);
                                    }}
                                    renderAnnotations={(arr: Annotation[]) =>
                                        arr.map(o => (
                                            <Panel.AnnotationCard
                                                key={o.id}
                                                data={o}
                                                edit={annotationData.edit}
                                                remove={annotationData.remove}
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
                    {(() => {
                        switch (activeTool) {
                            case CONFIG.TOOL.SELECT:
                                return <Panel.Select />;
                            case CONFIG.TOOL.BBOX:
                                return <Panel.Bbox />;
                            case CONFIG.TOOL.POLYGON:
                                return <Panel.Polygon />;
                            case CONFIG.TOOL.WAND:
                                return <Panel.MagicWand />;
                            case CONFIG.TOOL.BRUSH:
                                return <Panel.Brush />;
                            case CONFIG.TOOL.ERASER:
                                return <Panel.Eraser />;
                            case CONFIG.TOOL.KEYPOINTS:
                                return <Panel.Keypoints />;
                            case CONFIG.TOOL.DEXTR:
                                return <Panel.Dextr />;
                            default:
                                return null;
                        }
                    })()}
                </Box>
            </Box>

            <div className={classes.middlePanel}>
                <div className={classes.frame} onWheel={onWheelAction}>
                    <canvas
                        ref={canvasRef}
                        className={classes.canvas}
                        // !! very very important paper.js attribute for resize magic !!
                        data-paper-resize
                    />
                </div>
            </div>
        </div>
    );
};
export default Annotator;
