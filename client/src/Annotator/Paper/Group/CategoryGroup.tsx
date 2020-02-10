import paper from 'paper';

import * as CONFIG from '../../annotator.config';

class CategoryGroup extends paper.Group {
    constructor(categoryId: number) {
        super();
        this.name = CONFIG.CATEGORY_GROUP_PREFIX + categoryId;
        this.data = { categoryId };
    }

    public exportData() {
        return ''; // TODO
    }
}
export default CategoryGroup;
