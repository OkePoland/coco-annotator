import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

interface Props {
    classes: string;
    name: string;
    folders: string[];
    setFolders: React.Dispatch<React.SetStateAction<string[]>>;
    removeFolder(folder: string): void;
}

const Breadcrumb: React.FC<Props> = ({
    classes,
    name,
    folders,
    setFolders,
    removeFolder,
}) => (
    <Breadcrumbs className={classes}>
        <Link onClick={() => setFolders([])}>{name}</Link>
        {folders.map((folder, index) => {
            const isLastFolder = index === folders.length - 1;
            return isLastFolder ? (
                <Typography key={folder}>{folder}</Typography>
            ) : (
                <Link key={folder} onClick={() => removeFolder(folder)}>
                    {folder}
                </Link>
            );
        })}
    </Breadcrumbs>
);

export default Breadcrumb;
