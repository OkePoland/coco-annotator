import Api from '../common/api';

const baseURL = '/dataset';

export const getAll = async (page: number, limit: number) => {
    const url = `${baseURL}/data`;
    const params = {
        page: page,
        limit: limit,
    };
    const response = await Api.get(url, { params: params });
    return response;
};

export const create = async (name: string, categories?: Array<string>) => {
    const url = `${baseURL}/`;
    const params = {
        name: name,
    };
    const body = { categories: categories != null ? categories : [] };
    const response = await Api.post(url, body, { params: params });
    return response;
};

export const getDetails = async (
    id: number,
    page?: number,
    folder?: string,
    order?: string,
) => {
    const url = `${baseURL}/${id}/data`;

    let params = {
        page: page != null ? page : null,
        folder: folder,
        order: order,
        limit: 52,
    };

    const response = await Api.get<{
        total: number;
        per_page: number;
        pages: number;
        page: number;
        images: string[];
        folder: string;
        directory: string;
        dataset: any;
        categories: string[];
        subdirectories: string[];
        time_ms: number;
    }>(url, { params: params });

    return response;
};

export const generate = async (id: number, keyword: string, limit: number) => {
    const url = `${baseURL}/${id}/generate`;
    const body = {
        keywords: [keyword],
        limit: limit,
    };
    const response = await Api.post(url, body);
    return response;
};

export const scan = async (id: number) => {
    const url = `${baseURL}/${id}/scan`;
    const response = await Api.get(url);
    return response;
};

export const performExport = async (id: number, format: string) => {
    const url = `${baseURL}/${id}/${format}`;
    const response = await Api.get(url);
    return response;
};

export const getUsers = async (id: number) => {
    const url = `${baseURL}/${id}/users`;
    const response = await Api.get(url);
    return response;
};

export const getStats = async (id: number) => {
    const url = `${baseURL}/${id}/stats`;
    const response = await Api.get(url);
    return response;
};

export const getExports = async (id: number) => {
    const url = `${baseURL}/${id}/exports`;
    const response = await Api.get(url);
    return response;
};

export const getMetadata = async (id: number) => {
    const url = `${baseURL}/${id}/reset/metadata`;
    const response = await Api.get(url);
    return response;
};

// TODO
// getCoco
// uploadCoco
// exportingCOCO

// image requests
export const deleteImage = async (id: number) => {
    const url = `/image/${id}`;
    const response = await Api.delete(url);
    return response;
};

export const downloadImage = async () => {
    // TODO
    /*
    downloadURI(uri, exportName) {
      let link = document.createElement("a");
      link.href = uri;
      link.download = exportName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    openAnnotator() {
      this.$router.push({
        name: "annotate",
        params: { identifier: this.image.id }
      });
    },
    onDownloadClick() {
      this.downloadURI(
        "/api/image/" + this.image.id + "?asAttachment=true",
        this.image.file_name
      );

      axios.get("/api/image/" + this.image.id + "/coco").then(reponse => {
        let dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(reponse.data));
        this.downloadURI(
          dataStr,
          this.image.file_name.replace(/\.[^/.]+$/, "") + ".json"
        );
      });
    },    
    
    */
};
