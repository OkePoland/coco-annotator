import React from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TouchAppOutlinedIcon from '@material-ui/icons/TouchAppOutlined';

interface Props {
    className: string;
    tooltipOn: boolean;
    setTooltipOn: (on: boolean) => void;
}

const Select: React.FC<Props> = ({ className, tooltipOn, setTooltipOn }) => (
    <Box className={className}>
        <TouchAppOutlinedIcon />

        <Box>
            <FormControlLabel
                label="Tooltip ON"
                labelPlacement="start"
                control={
                    <Checkbox
                        color="primary"
                        checked={tooltipOn}
                        onChange={() => {
                            setTooltipOn(!tooltipOn);
                        }}
                    />
                }
            />
        </Box>
    </Box>
);
export default Select;
