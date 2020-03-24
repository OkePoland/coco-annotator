import React from 'react';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface Props {
    title: string;
    open: boolean;
    setClose(): void;
    renderContent?(): JSX.Element;
    renderActions?(): JSX.Element;
}

const CustomDialog: React.FC<Props> = ({
    title,
    open,
    setClose,
    renderContent,
    renderActions,
}) => (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={setClose}>
        <MuiDialogTitle>
            <Typography>{title}</Typography>
            <Box position="absolute" top={10} right={10}>
                <IconButton size="small" onClick={setClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </MuiDialogTitle>

        <MuiDialogContent dividers>
            {renderContent && renderContent()}
        </MuiDialogContent>

        <MuiDialogActions>
            {renderActions && renderActions()}

            <Button variant="contained" onClick={setClose}>
                Close
            </Button>
        </MuiDialogActions>
    </Dialog>
);
export default CustomDialog;
