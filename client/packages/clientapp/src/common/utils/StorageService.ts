const StorageService = {
    get: <T = any>(key: string) =>
        new Promise<T>(resolve => {
            const value = localStorage.getItem(key);
            if (value) {
                resolve(JSON.parse(value));
            }
            resolve();
        }),

    set: <T = any>(key: string, value: T) =>
        new Promise<void>(resolve => {
            localStorage.setItem(key, JSON.stringify(value));
            resolve();
        }),

    remove: (key: string) =>
        new Promise<void>(resolve => {
            localStorage.removeItem(key);
            resolve();
        }),

    has: (key: string): Promise<boolean> =>
        new Promise<boolean>(resolve => {
            const value = localStorage.getItem(key);
            if (value) {
                resolve(true);
            }
            resolve(false);
        }),
};

export default StorageService;
