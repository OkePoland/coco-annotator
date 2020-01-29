import { useState, useMemo, useCallback } from 'react';

import { Category } from '../../common/types';

interface IUseFilter {
    (categories: Category[]): UseFilterResponse;
}
interface UseFilterResponse {
    searchText: string;
    filterObj: FilterObj;
    setSearchText: (val: string) => void;
}

interface FilterObj {
    [key: number]: boolean;
}

const useFilter: IUseFilter = categories => {
    const [searchText, _setSearchText] = useState<string>('');

    const filterObj: FilterObj = useMemo(() => {
        const search = searchText.toLowerCase();
        let ids: number[] = [];
        if (searchText.length >= 2) {
            ids = categories
                .filter(category =>
                    category.name.toLowerCase().includes(search),
                )
                .map(o => o.id);
        } else {
            ids = categories.map(o => o.id);
        }
        return ids.reduce((prevObj: FilterObj, item: number) => {
            prevObj[item] = true;
            return prevObj;
        }, {});
    }, [categories, searchText]);

    const setSearchText = useCallback((value: string) => {
        _setSearchText(value || '');
    }, []);

    return {
        searchText,
        filterObj,
        setSearchText,
    };
};
export default useFilter;
