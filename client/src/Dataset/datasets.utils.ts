export const downloadURI = (uri: string, exportName: string) => {
    let link = document.createElement('a');
    link.href = uri;
    link.download = exportName;
    document.body.appendChild(link);
    link.click();
    link.remove();
};
