import React, { Fragment } from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import { useStyles } from './annotator.styles';
import {
    useUserChoices,
    useCanvas,
    useData,
    usePainter,
} from './annotator.hooks';
import { Tools, Annotation, Utils, Settings } from './Menu';
import Panel from './Panel/Panel';

const Annotator: React.FC<{ imageId: number }> = ({ imageId }) => {
    const classes = useStyles();
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

    const data = useData(imageId);

    usePainter(imageData.rasterSize, data.filename);

    return (
        <div className={classes.root}>
            <Box className={classes.leftPanel}>
                {segmentOn && (
                    <Fragment>
                        <Tools
                            enabled={annotateOn}
                            activeTool={activeTool}
                            toggleTool={toggleTool}
                        />
                        <Divider className={classes.divider} />
                        <Annotation
                            annotationAction={() => {}}
                            annotationCopyAction={() => {}}
                            setAnnotationOn={() => {}}
                        />
                        <Divider className={classes.divider} />
                    </Fragment>
                )}
                <Utils
                    centerImageAction={centerImageAction}
                    undoAction={() => {}}
                />
                <Divider className={classes.divider} />
                <Settings
                    segmentOn={segmentOn}
                    setSegmentOn={setSegmentOn}
                    downloadImageAction={() => {}}
                    saveImageAction={() => {}}
                    openImageAction={() => {}}
                    deleteImageAction={() => {}}
                />
            </Box>

            <Box className={classes.rightPanel}>
                <Panel />
                <pre>{JSON.stringify(activeTool)}</pre>
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
