import React from 'react';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

import { useStyles } from './categoryCard.styles';

interface Props {
    id: number;
    name: string;
    color: string;
    isVisible: boolean;
    isSelected: boolean;
    isEnabled: boolean;
    isExpanded: boolean;
    annotationCount: number;

    setSelected: (id: number) => void;
    setEnabled: (id: number) => void;
    setExpanded: (id: number) => void;
    editCategory: () => void;
    addAnnotation: (id: number) => void;

    renderExpandedList: () => JSX.Element[];
}

const CategoryCard: React.FC<Props> = ({
    id,
    name,
    color,
    isVisible,
    isSelected,
    isEnabled,
    isExpanded,
    annotationCount,

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
            <Grid
                container
                justify="center"
                alignItems="center"
                className={classes.row}
            >
                <Grid item xs>
                    <IconButton
                        disabled={annotationCount === 0}
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
                        {isEnabled ? (
                            <VisibilityOutlinedIcon />
                        ) : (
                            <VisibilityOffOutlinedIcon />
                        )}
                    </IconButton>
                </Grid>
                <Grid item xs={7}>
                    <Typography
                        className={classes.title}
                        onClick={() => {
                            if (!isSelected) {
                                setSelected(id);
                            }
                            setExpanded(id);
                        }}
                    >
                        {`${name} (${annotationCount})`}
                    </Typography>
                </Grid>
                <Grid item xs className={classes.iconCell}>
                    <IconButton
                        size="small"
                        color="inherit"
                        onKeyPress={e => {
                            e.preventDefault();
                        }}
                        onClick={() => {
                            addAnnotation(id);
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>
                <Grid item xs className={classes.iconCell}>
                    <IconButton
                        size="small"
                        color="inherit"
                        onKeyPress={e => {
                            e.preventDefault();
                        }}
                        onClick={editCategory}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Grid>
            </Grid>

            <Collapse in={isExpanded}>
                <Divider />
                {isExpanded && annotationCount > 0 && renderExpandedList()}
            </Collapse>
        </Card>
    );
};
export default CategoryCard;
