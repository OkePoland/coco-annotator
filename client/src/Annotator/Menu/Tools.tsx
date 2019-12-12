import React, { Fragment } from 'react';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TouchAppOutlinedIcon from '@material-ui/icons/TouchAppOutlined';
import WallpaperOutlinedIcon from '@material-ui/icons/WallpaperOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import BrushOutlinedIcon from '@material-ui/icons/BrushOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import LocationSearchingOutlinedIcon from '@material-ui/icons/LocationSearchingOutlined';

import { TOOL } from '../annotator.config';
import ToolButton from './ToolButton';

interface Props {
    enabled: boolean;
    activeTool: TOOL | null;
    toggleTool: (name: TOOL) => void;
}

const ToolBar: React.FC<Props> = ({ enabled, activeTool, toggleTool }) => (
    <Fragment>
        <ToolButton
            name="Select"
            icon={<TouchAppOutlinedIcon />}
            active={activeTool === TOOL.SELECT}
            enabled={enabled}
            onClick={() => toggleTool(TOOL.SELECT)}
        />

        <Box mt={2} mb={2}>
            <Divider />
        </Box>

        <ToolButton
            name="BBox"
            icon={<WallpaperOutlinedIcon />}
            active={activeTool === TOOL.BBOX}
            enabled={enabled}
            onClick={() => toggleTool(TOOL.BBOX)}
        />
        <ToolButton
            name="Polygon"
            icon={<CreateOutlinedIcon />}
            active={activeTool === TOOL.POLYGON}
            enabled={enabled}
            onClick={() => toggleTool(TOOL.POLYGON)}
        />
        <ToolButton
            name="Magic Wand"
            icon={<BorderColorIcon />}
            active={activeTool === TOOL.WAND}
            enabled={enabled}
            onClick={() => toggleTool(TOOL.WAND)}
        />
        <ToolButton
            name="Brush"
            icon={<BrushOutlinedIcon />}
            active={activeTool === TOOL.BRUSH}
            enabled={enabled}
            onClick={() => toggleTool(TOOL.BRUSH)}
        />
        <ToolButton
            name="Eraser"
            icon={<TouchAppOutlinedIcon />}
            active={activeTool === TOOL.ERASER}
            enabled={enabled}
            onClick={() => toggleTool(TOOL.ERASER)}
        />
        <ToolButton
            name="Keypoints"
            icon={<RoomOutlinedIcon />}
            active={activeTool === TOOL.KEYPOINTS}
            enabled={enabled}
            onClick={() => toggleTool(TOOL.KEYPOINTS)}
        />
        <ToolButton
            name="DEXTR"
            icon={<LocationSearchingOutlinedIcon />}
            active={activeTool === TOOL.DEXTR}
            enabled={enabled}
            onClick={() => toggleTool(TOOL.DEXTR)}
        />
    </Fragment>
);

export default ToolBar;
