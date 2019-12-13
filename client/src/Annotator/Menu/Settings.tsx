import React, { Fragment } from 'react';
import { Dispatch, SetStateAction } from 'react';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import SaveIcon from '@material-ui/icons/Save';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';

import ToolButton from './ToolButton';

interface Props {
    downloadImageAction: () => void;
    saveImageAction: () => void;
    openImageAction: () => void;
    deleteImageAction: () => void;
    segmentOn: boolean;
    setSegmentOn: Dispatch<SetStateAction<boolean>>;
}

export const Settings: React.FC<Props> = ({
    downloadImageAction,
    saveImageAction,
    openImageAction,
    deleteImageAction,
    segmentOn,
    setSegmentOn,
}) => (
    <Fragment>
        <ToolButton
            name="Download COCO"
            icon={<SaveAltIcon />}
            enabled={true}
            active={false}
            onClick={downloadImageAction}
        />
        <ToolButton
            name="Save"
            icon={<SaveIcon />}
            enabled={true}
            active={false}
            onClick={saveImageAction}
        />
        <ToolButton
            name={`Mode: ${segmentOn ? 'segment' : 'label'}`}
            icon={segmentOn ? <ImageSearchIcon /> : <LabelOutlinedIcon />}
            enabled={true}
            active={false}
            onClick={() => {
                setSegmentOn(c => !c);
            }}
        />
        <ToolButton
            name="Select"
            icon={<SettingsIcon />}
            enabled={true}
            active={false}
            onClick={openImageAction}
        />

        <Box mt={2} mb={2}>
            <Divider />
        </Box>

        <ToolButton
            name="Delete Image"
            icon={<DeleteIcon />}
            enabled={true}
            active={false}
            onClick={deleteImageAction}
        />
    </Fragment>
);

export default Settings;
