import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

interface Props {
    name: string;
    icon: JSX.Element;
    enabled: boolean;
    active: boolean;
    onClick: () => void;
}

const ToolButton: React.FC<Props> = ({
    name,
    icon,
    enabled,
    active,
    onClick,
}) => (
    <Tooltip
        title={
            enabled
                ? `${name} tool`
                : `${name} (select an annotation to activate tool)`
        }
        placement="right"
    >
        <div>
            <IconButton
                size="small"
                color={active ? 'primary' : 'inherit'}
                disabled={!enabled}
                onClick={onClick}
            >
                {icon}
            </IconButton>
        </div>
    </Tooltip>
);
export default ToolButton;
