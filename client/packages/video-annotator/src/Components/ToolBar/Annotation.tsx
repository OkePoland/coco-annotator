import React, { Fragment } from 'react';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import ToolButton from './ToolButton';

interface Props {
    annotationAction: () => void;
    annotationCopyAction: () => void;
    setCategoriesEnabled: (isOn: boolean) => void;
}

const Annotation: React.FC<Props> = ({
    annotationCopyAction,
    setCategoriesEnabled,
}) => (
    <Fragment>
        <ToolButton
            name="Show All"
            icon={<VisibilityIcon />}
            enabled={true}
            onClick={() => {
                setCategoriesEnabled(true);
            }}
        />
        <ToolButton
            name="Hide All"
            icon={<VisibilityOffIcon />}
            enabled={true}
            onClick={() => {
                setCategoriesEnabled(false);
            }}
        />
        <ToolButton
            name="Copy Annotations"
            icon={<FileCopyIcon />}
            enabled={true}
            onClick={annotationCopyAction}
        />
    </Fragment>
);

export default Annotation;
