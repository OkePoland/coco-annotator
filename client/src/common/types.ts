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
    last_seen?: {
        $date: number;
    };
    is_admin: boolean;
    permissions?: [];
    preferences?: Preferences | {};
    new?: boolean;
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
    keypoints: [];
    metadata: IDict;
    paper_object: [];
    deleted: boolean;
    deleted_date?: {
        $date: number;
    };
    milliseconds: number;
    events?: [];
}

export interface IDict {
    [key: string]: any;
}

export enum UndoType {
    ALL = 'all',
    ANNOTATION = 'annotation',
    CATEGORY = 'category',
    DATASET = 'dataset',
}

export interface Task {
    id: number;
    group: string;
    name: string;
    completed: boolean;
    progress: number;
    errors: number;
    warnings: number;
}

export interface Undo {
    id: number;
    name: string;
    instance: UndoType;
    ago: string;
    date: string;
}

export interface DatasetPermissions {
    owner?: boolean;
    edit?: boolean;
    share?: boolean;
    generate?: boolean;
    delete?: boolean;
    download?: boolean;
}

export interface ImagePermissions {
    delete: boolean;
    download: boolean;
}

export interface Preferences {
    bbox: {
        blackOrWhite: boolean;
        auto: boolean;
        radius: number;
    };
    polygon: {
        guidance: boolean;
        completeDistance: number;
        minDistance: number;
        blackOrWhite: boolean;
        auto: boolean;
        radius: number;
    };
    eraser: {
        strokeColor: string;
        radius: number;
    };
    brush: {
        strokeColor: string;
        radius: number;
    };
    magicwand: {
        threshold: number;
        blur: number;
    };
    select: {
        showText: boolean;
    };
    settings: {
        shortcuts: Array<Shortcuts>;
    };
}

type Shortcuts = {
    name: string;
    keys: string[];
};
