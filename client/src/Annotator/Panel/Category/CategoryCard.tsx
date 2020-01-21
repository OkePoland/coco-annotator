import React from 'react';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

import { Category } from '../../../common/types';
import { useStyles } from './categoryCard.styles';

interface Props {
    data: Category;
    isVisible: boolean;
    isSelected: boolean;
    isEnabled: boolean;
    isExpanded: boolean;

    setSelected: (id: number) => void;
    setEnabled: (id: number) => void;
    setExpanded: (id: number) => void;
    editCategory: (id: number) => void;
    addAnnotation: (id: number) => void;

    renderExpandedList: () => JSX.Element[];
}

const CategoryCard: React.FC<Props> = ({
    data: { id, name, annotations, color },
    isVisible,
    isSelected,
    isEnabled,
    isExpanded,

    setSelected,
    setEnabled,
    setExpanded,
    editCategory,
    addAnnotation,
    renderExpandedList,
}) => {
    const classes = useStyles({ color });

    if (!isVisible) {
        return null;
    }

    return (
        <Card className={clsx(classes.root, isSelected && classes.selected)}>
            <Grid container justify="center" alignItems="center">
                <Grid item xs>
                    <IconButton
                        size="small"
                        className={clsx(
                            isEnabled
                                ? isExpanded
                                    ? classes.expanededEye
                                    : classes.colorEye
                                : classes.disabledEye,
                        )}
                        onClick={() => {
                            setEnabled(id);
                        }}
                    >
                        {isEnabled ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                </Grid>
                <Grid item xs={7}>
                    <Typography
                        align="center"
                        onClick={() => {
                            if (!isSelected) {
                                setSelected(id);
                            }
                            setExpanded(id);
                        }}
                    >
                        {`${name} (${annotations && annotations.length})`}
                    </Typography>
                </Grid>
                <Grid item xs>
                    <IconButton
                        size="small"
                        color="inherit"
                        onClick={() => {
                            addAnnotation(id);
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>
                <Grid item xs>
                    <IconButton
                        size="small"
                        color="inherit"
                        onClick={() => {
                            editCategory(id);
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Grid>
            </Grid>

            <Collapse in={isExpanded}>
                <Divider />
                {isExpanded && annotations && renderExpandedList()}
            </Collapse>
        </Card>
    );
};
export default CategoryCard;
