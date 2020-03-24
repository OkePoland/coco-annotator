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
    permissions?: DatasetPermissions;
}

export interface Image {
    id: number;
    file_name: string;
    annotated: boolean;
    annotating: [];
    num_annotations: number;
    category_ids?: [number];
    dataset_id?: number;
    deleted?: boolean;
    events?: [];
    height?: number;
    is_modified?: boolean;
    metadata?: {} | null;
    milliseconds?: number;
    next?: number;
    path?: string;
    previous?: number | null;
    regenerate_thumbnail?: boolean;
    width?: number;
}

export interface Category {
    id: number;
    name: string;
    supercategory: string;
    color: string;
    metadata: {};
    creator?: string;
    deleted?: boolean;
    deleted_date?: {
        $date: number;
    };
    keypoint_edges?: [];
    keypoint_labels?: [];
    show?: boolean;
    visualize?: boolean;
    numberAnnotations: number;
    annotations?: Annotation[];
}

export interface Annotation {
    id: number;
    name?: string;
    image_id: number;
    category_id: number;
    dataset_id: number;
    segmentation: Array<Array<number>>;
    area: number;
    bbox: number[];
    iscrowd: boolean;
    isbbox: boolean;
    creator: string;
    width: number;
    height: number;
    color: string;
    keypoints: {
        keypoints: {
            pointId: number;
            x: number;
            y: number;
        }[];
        edges: [number, number][];
    };
    metadata: IDict;
    paper_object: [];
    deleted: boolean;
    deleted_date?: {
        $date: number;
    };
    milliseconds: number;
    events?: [];
}

export interface DatasetPermissions {
    owner?: boolean;
    edit?: boolean;
    share?: boolean;
    generate?: boolean;
    delete?: boolean;
    download?: boolean;
}

export interface IDict {
    [key: string]: any;
}