import axios from "axios";

const baseURL = "/api/export";


export default {
  download(id, dataset, extension="json") {
    axios({
      url: `${baseURL}/${id}/download`,
      method: "GET",
      responseType: "blob"
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${dataset}-${id}.${extension}`);
      document.body.appendChild(link);
      link.click();
    });
  }
};
