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

import { Category, Annotation } from '../../../common/types';
import { useStyles } from './categoryCard.styles';

interface Props {
    data: Category;
    isActive: boolean;
    isEnable: boolean;
    isExpand: boolean;

    setActiveId: (id: number) => void;
    setEnableId: (id: number) => void;
    setExpandId: (id: number) => void;
    editCategory: (id: number) => void;
    addAnnotation: (id: number) => void;

    renderAnnotations: (annotations: Annotation[]) => JSX.Element[];
}

const CategoryCard: React.FC<Props> = ({
    data: { id, name, annotations, color },
    isActive,
    isEnable,
    isExpand,

    setActiveId,
    setEnableId,
    setExpandId,
    editCategory,
    addAnnotation,
    renderAnnotations,
}) => {
    const classes = useStyles({ color });

    return (
        <Card className={clsx(classes.root, isActive && classes.active)}>
            <Grid container justify="center" alignItems="center">
                <Grid item xs>
                    <IconButton
                        size="small"
                        className={clsx(
                            isEnable
                                ? isExpand
                                    ? classes.expanededEye
                                    : classes.colorEye
                                : classes.disabledEye,
                        )}
                        onClick={() => {
                            setEnableId(id);
                        }}
                    >
                        {isEnable ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                </Grid>
                <Grid item xs={7}>
                    <Typography
                        align="center"
                        onClick={() => {
                            setActiveId(id);
                            setExpandId(id);
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

            <Collapse in={isExpand}>
                <Divider />
                {isExpand && annotations && renderAnnotations(annotations)}
            </Collapse>
        </Card>
    );
};
export default CategoryCard;
