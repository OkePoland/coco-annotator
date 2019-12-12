import React, { Fragment } from 'react';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import ToolButton from './ToolButton';

interface Props {
    annotationAction: () => void;
    annotationCopyAction: () => void;
    setAnnotationOn: (on: boolean) => void;
}

export const Annotation: React.FC<Props> = ({
    annotationAction,
    annotationCopyAction,
    setAnnotationOn,
}) => (
    <Fragment>
        <ToolButton
            name="Annotate url"
            icon={<CloudDownloadIcon />}
            enabled={true}
            active={false}
            onClick={() => {
                annotationAction();
            }}
        />
        <ToolButton
            name="Copy Annotations"
            icon={<FileCopyIcon />}
            enabled={true}
            active={false}
            onClick={() => {
                annotationCopyAction();
            }}
        />
        <ToolButton
            name="Show All"
            icon={<VisibilityIcon />}
            enabled={true}
            active={false}
            onClick={() => {
                setAnnotationOn(true);
            }}
        />
        <ToolButton
            name="Hide All"
            icon={<VisibilityOffIcon />}
            enabled={true}
            active={false}
            onClick={() => {
                setAnnotationOn(false);
            }}
        />
    </Fragment>
);

export default Annotation;
