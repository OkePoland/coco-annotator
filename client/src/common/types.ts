export interface AppInfo {
    name: string;
    author: string;
    demo: string;
    repo: string;
    git: {
        tag: string;
    };
    login_enabled: boolean;
    total_users: number;
    allow_registration: boolean;
}

export interface UserInfo {
    id: {
        $oid: string;
    };
    username: string;
    name: string;
    online: boolean;
    last_seen: {
        $date: number;
    };
    is_admin: boolean;
}

export interface Dataset {
    id: number;
    name: string;
    directory: string;
    first_image_id?: number;
    numberAnnotated: number;
    numberImages: number;
    categories: Array<number>;
    owner: string;
    users: Array<string>;
    annotate_url: string;
    default_annotation_metadata: IDict;
    deleted: boolean;
    deleted_date?: {
        $data: number;
    };
}

export interface Image {
    id: number;
    file_name: string;
    annotated: boolean;
    annotating: [];
    num_annotations: number;
}

export interface Category {
    id: number;
    name: string;
    supercategory: string;
    color: string;
    metadata: {};
    creator: string;
    deleted: boolean;
    keypoint_edges: [];
    keypoint_labels: [];
    numberAnnotations: number;
    annotations?: Annotation[];
}

export interface Annotation {
    id: number;
    name?: string;
    image_id: number;
    category_id: number;
    dataset_id: number;
    segmentation: [];
    area: number;
    bbox: number[];
    iscrowd: boolean;
    isbbox: boolean;
    creator: string;
    width: number;
    height: number;
    color: string;
    keypoints: [];
    metadata: IDict;
    paper_object: [];
    deleted: boolean;
    milliseconds: number;
}

interface IDict {
    [key: string]: any;
}
