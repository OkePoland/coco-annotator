export interface AppInfo {
    name: string;
    author: string;
    demo: string;
    repo: string;
    git: { tag: string };
    login_enabled: boolean;
    total_users: number;
    allow_registration: boolean;
}

export interface UserInfo {
    id: { $oid: string };
    username: string;
    name: string;
    online: boolean;
    last_seen: { $data: Date };
    is_admin: boolean;
    preferences: {}; // TODO
    permissions: []; // TODO
}

export interface Dataset {
    id: string;
    name: string;
    // TODO update with rest of fields
}

// TODO update with rest of global types
