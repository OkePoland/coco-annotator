import axios from "axios";

const baseURL = "/api/dataset";

export default {
  allData(params) {
    return axios.get(`${baseURL}/data`, {
      params: {
        ...params
      }
    });
  },
  getData(id, params) {
    return axios.get(`${baseURL}/${id}/data`, {
      params: {
        ...params
      }
    });
  },
  create(name, categories) {
    return axios.post(`${baseURL}/?name=${name}`, {
      categories: categories
    });
  },
  generate(id, body) {
    return axios.post(`${baseURL}/${id}/generate`, {
      ...body
    });
  },
  scan(id) {
    return axios.get(`${baseURL}/${id}/scan`);
  },
  exportingCOCO(id, categories, format, validation_size, testing_size, tfrecord_train_num_shards, tfrecord_val_num_shards,
                tfrecord_test_num_shards) {
    if (validation_size==="") validation_size = 0;
    if (testing_size==="") testing_size = 0;
    if (tfrecord_train_num_shards==null) tfrecord_train_num_shards = 1;
    if (tfrecord_val_num_shards==null) tfrecord_val_num_shards = 1;
    if (tfrecord_test_num_shards==null) tfrecord_test_num_shards = 1;
    return axios.get(`${baseURL}/${id}/export?categories=${categories}&export_format=${format}&validation_size=${validation_size}&testing_size=${testing_size}&tfrecord_train_num_shards=${tfrecord_train_num_shards}&tfrecord_val_num_shards=${tfrecord_val_num_shards}&tfrecord_test_num_shards=${tfrecord_test_num_shards}`);
  },
  getCoco(id) {
    return axios.get(`${baseURL}/${id}/coco`);
  },
  uploadCoco(id, files, path_string) {

    let form = new FormData();
     for (var i = 0; i < files.length; i++) {
            let file = files.item(i);
            form.append('coco', file, file.name);
        }
     form.append('path_string', path_string);
    //form.append("coco", files.item(0));

    return axios.post(`${baseURL}/${id}/coco`, form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  export(id, format) {
    return axios.get(`${baseURL}/${id}/${format}`);
  },
  getUsers(id) {
    return axios.get(`${baseURL}/${id}/users`);
  },
  getStats(id) {
    return axios.get(`${baseURL}/${id}/stats`);
  },
  getExports(id) {
    return axios.get(`${baseURL}/${id}/exports`);
  },
  resetMetadata(id) {
    return axios.get(`${baseURL}/${id}/reset/metadata`);
  },
  resetAnnotations(id) {
    return axios.get(`${baseURL}/${id}/reset/annotations`);
  }
};
