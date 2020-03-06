import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

interface Props {
    name: string;
    icon: JSX.Element;
    enabled: boolean;
    active?: boolean;
    tooltipText?: string;
    onClick: () => void;
}

const ToolButton: React.FC<Props> = ({
    name,
    icon,
    enabled,
    active,
    tooltipText,
    onClick,
}) => (
    <Tooltip title={tooltipText || name} placement="right">
        <div>
            <IconButton
                size="small"
                color={active ? 'primary' : 'inherit'}
                disabled={!enabled}
                onClick={onClick}
                onKeyDown={event => {
                    event.preventDefault();
                }}
            >
                {icon}
            </IconButton>
        </div>
    </Tooltip>
);
export default ToolButton;
