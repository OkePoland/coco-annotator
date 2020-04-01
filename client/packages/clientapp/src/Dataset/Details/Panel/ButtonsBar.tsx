import React from 'react';
import { Formik, Form } from 'formik';
import { useNavigation } from 'react-navi';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import { useStyles } from './panel.styles';
import CustomDialog from '../../../common/components/CustomDialog';
import TextField from '../../../common/components/Formik/TextField';
import TagsInput from '../../../common/components/Formik/TagsInput';
import { useFormikGenerate, useFormikExport, useFormikImport } from './Formik';
import { DialogsState, ICategory } from '../details.hooks';
import { useTaskProgressState } from './buttonBar.hooks';

interface Props {
    id: number;
    categories: ICategory[];
    tags: string[];
    dialogs: DialogsState;
    resetMetadataAction(): void;
}

const SubdirForm: React.FC<Props> = ({
    id,
    tags,
    categories,
    dialogs,
    resetMetadataAction,
}) => {
    const classes = useStyles();
    const { navigate } = useNavigation();

    const {
        generate: [generateOn, setGenerateOn],
        exportDialog: [exportOn, setExportOn],
        importDialog: [importOn, setImportOn],
    } = dialogs;
    const {
        scanInfo,
        exportInfo,
        setExportInfo,
        importInfo,
        setImportInfo,
        scanAction,
    } = useTaskProgressState(id);

    const formikGenerate = useFormikGenerate(id);
    const formikExport = useFormikExport(id, categories, setExportInfo);
    const formikImport = useFormikImport(id, setImportInfo);

    return (
        <>
            <Grid container direction="column" spacing={1}>
                <Grid item>
                    <Button
                        fullWidth
                        variant="contained"
                        className={classes.generateButton}
                        onClick={() => setGenerateOn(true)}
                    >
                        Generate
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        fullWidth
                        variant="contained"
                        className={classes.scanButton}
                        onClick={() => {
                            if (scanInfo.id !== null) {
                                navigate({
                                    pathname: '/tasks',
                                    query: { id: `${scanInfo.id}` },
                                });
                            } else {
                                scanAction();
                            }
                        }}
                    >
                        {scanInfo.id !== null ? 'Scanning' : 'Scan'}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        fullWidth
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            if (importInfo.id !== null) {
                                navigate({
                                    pathname: '/tasks',
                                    query: { id: `${importInfo.id}` },
                                });
                            } else {
                                setImportOn(true);
                            }
                        }}
                    >
                        {importInfo.id !== null ? 'Importing' : 'Import COCO'}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        fullWidth
                        variant="contained"
                        className={classes.exportButton}
                        onClick={() => {
                            if (exportInfo.id !== null) {
                                navigate({
                                    pathname: '/tasks',
                                    query: { id: `${exportInfo.id}` },
                                });
                            } else {
                                setExportOn(true);
                            }
                        }}
                    >
                        {exportInfo.id !== null ? 'Exporting' : 'Export COCO'}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        fullWidth
                        variant="contained"
                        className={classes.resetButton}
                        onClick={resetMetadataAction}
                    >
                        Reset Metadata
                    </Button>
                </Grid>
            </Grid>
            <Formik
                initialValues={formikGenerate.initialValues}
                validationSchema={formikGenerate.validationSchema}
                onSubmit={formikGenerate.onSubmit}
            >
                {formik => (
                    <CustomDialog
                        title="Generate a Dataset"
                        open={generateOn}
                        setClose={() => {
                            setGenerateOn(false);
                            formik.resetForm();
                        }}
                        renderContent={() => (
                            <Form>
                                <TextField name="keyword" label="Keyword" />
                                <TextField name="limit" label="Limit" />
                            </Form>
                        )}
                        renderActions={() => (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={formik.submitForm}
                            >
                                Generate
                            </Button>
                        )}
                    />
                )}
            </Formik>

            <Formik
                initialValues={formikImport.initialValues}
                validationSchema={formikImport.validationSchema}
                onSubmit={formikImport.onSubmit}
            >
                {({ resetForm, setFieldValue, submitForm }) => (
                    <CustomDialog
                        title="Upload COCO Annotaitons"
                        open={importOn}
                        setClose={() => {
                            setImportOn(false);
                            resetForm();
                        }}
                        renderContent={() => (
                            <Box className={classes.importDialog}>
                                <label>COCO Annotation file (.json)</label>
                                <input
                                    name="coco"
                                    accept="application/JSON"
                                    className={classes.uploadInput}
                                    type="file"
                                    onChange={(event: any) => {
                                        setFieldValue(
                                            'coco',
                                            event.target.files[0],
                                        );
                                    }}
                                />
                            </Box>
                        )}
                        renderActions={() => (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={async () => {
                                    await submitForm();
                                    setImportOn(false);
                                }}
                            >
                                Upload
                            </Button>
                        )}
                    />
                )}
            </Formik>

            <Formik
                initialValues={formikExport.initialValues}
                onSubmit={formikExport.onSubmit}
            >
                {formik => (
                    <CustomDialog
                        title="Export name"
                        open={exportOn}
                        setClose={() => {
                            setExportOn(false);
                            formik.resetForm();
                        }}
                        renderContent={() => (
                            <Form>
                                <TagsInput
                                    options={tags}
                                    name="categories"
                                    placeholder="Categories (Empty export all)"
                                    classes={{
                                        tagsInput: classes.tagsInput,
                                        tagsList: classes.tagsList,
                                        tagsGrid: classes.tagsGrid,
                                    }}
                                />
                            </Form>
                        )}
                        renderActions={() => (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={async () => {
                                    await formik.submitForm();
                                    setExportOn(false);
                                }}
                            >
                                Export
                            </Button>
                        )}
                    />
                )}
            </Formik>
        </>
    );
};
export default SubdirForm;
