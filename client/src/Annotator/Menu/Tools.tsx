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

import { Tool } from '../annotator.types';
import ToolButton from './ToolButton';

interface Props {
    enabled: boolean;
    activeTool: Tool | null;
    toggleTool: (name: Tool) => void;
}

const ToolBar: React.FC<Props> = ({ enabled, activeTool, toggleTool }) => (
    <Fragment>
        <ToolButton
            name="Select"
            icon={<TouchAppOutlinedIcon />}
            active={activeTool === Tool.SELECT}
            enabled={enabled}
            onClick={() => toggleTool(Tool.SELECT)}
        />

        <Box mt={2} mb={2}>
            <Divider />
        </Box>

        <ToolButton
            name="BBox"
            icon={<WallpaperOutlinedIcon />}
            active={activeTool === Tool.BBOX}
            enabled={enabled}
            onClick={() => toggleTool(Tool.BBOX)}
        />
        <ToolButton
            name="Polygon"
            icon={<CreateOutlinedIcon />}
            active={activeTool === Tool.POLYGON}
            enabled={enabled}
            onClick={() => toggleTool(Tool.POLYGON)}
        />
        <ToolButton
            name="Magic Wand"
            icon={<BorderColorIcon />}
            active={activeTool === Tool.WAND}
            enabled={enabled}
            onClick={() => toggleTool(Tool.WAND)}
        />
        <ToolButton
            name="Brush"
            icon={<BrushOutlinedIcon />}
            active={activeTool === Tool.BRUSH}
            enabled={enabled}
            onClick={() => toggleTool(Tool.BRUSH)}
        />
        <ToolButton
            name="Eraser"
            icon={<TouchAppOutlinedIcon />}
            active={activeTool === Tool.ERASER}
            enabled={enabled}
            onClick={() => toggleTool(Tool.ERASER)}
        />
        <ToolButton
            name="Keypoints"
            icon={<RoomOutlinedIcon />}
            active={activeTool === Tool.KEYPOINTS}
            enabled={enabled}
            onClick={() => toggleTool(Tool.KEYPOINTS)}
        />
        <ToolButton
            name="DEXTR"
            icon={<LocationSearchingOutlinedIcon />}
            active={activeTool === Tool.DEXTR}
            enabled={enabled}
            onClick={() => toggleTool(Tool.DEXTR)}
        />
    </Fragment>
);

export default ToolBar;
