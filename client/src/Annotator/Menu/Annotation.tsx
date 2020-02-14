import React, { Fragment } from 'react';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import ToolButton from './ToolButton';

interface Props {
    annotationAction: () => void;
    annotationCopyAction: () => void;
    setCategoriesEnabled: (isOn: boolean) => void;
}

export const Annotation: React.FC<Props> = ({
    annotationAction,
    annotationCopyAction,
    setCategoriesEnabled,
}) => (
    <Fragment>
        <ToolButton
            name="Show All"
            icon={<VisibilityIcon />}
            enabled={true}
            active={false}
            onClick={() => {
                setCategoriesEnabled(true);
            }}
        />
        <ToolButton
            name="Hide All"
            icon={<VisibilityOffIcon />}
            enabled={true}
            active={false}
            onClick={() => {
                setCategoriesEnabled(false);
            }}
        />
        <ToolButton
            name="Annotate url"
            icon={<CloudDownloadIcon />}
            enabled={false}
            active={false}
            onClick={annotationAction}
        />
        <ToolButton
            name="Copy Annotations"
            icon={<FileCopyIcon />}
            enabled={false}
            active={false}
            onClick={annotationCopyAction}
        />
    </Fragment>
);

export default Annotation;
