import { useState, useMemo, useCallback } from 'react';

import { Category } from '../../common/types';

interface IUseFilter {
    (categories: Category[]): UseFilterResponse;
}
interface UseFilterResponse {
    searchText: string;
    filteredIds: number[];
    setSearchText: (val: string) => void;
}

const useFilter: IUseFilter = categories => {
    const [searchText, _setSearchText] = useState<string>('');

    const filteredIds: number[] = useMemo(() => {
        if (searchText.length <= 2) {
            return categories.map(o => o.id);
        }
        const search = searchText.toLowerCase();
        const cats = categories.filter(category =>
            category.name.toLowerCase().includes(search),
        );
        return cats.map(o => o.id);
    }, [categories, searchText]);

    const setSearchText = useCallback((value: string) => {
        _setSearchText(value ? value : '');
    }, []);

    return {
        searchText,
        filteredIds,
        setSearchText,
    };
};
export default useFilter;
