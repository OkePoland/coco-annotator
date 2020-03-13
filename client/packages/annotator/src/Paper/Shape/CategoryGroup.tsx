import paper from 'paper';

import * as CONFIG from '../../annotator.config';

class CategoryGroup extends paper.Group {
    constructor(categoryId: number) {
        super();
        this.name = CONFIG.CATEGORY_GROUP_PREFIX + categoryId;
        this.data = { categoryId };
    }

    set fillColor(color: paper.Color | null) {
        this.children.forEach(child => {
            child.fillColor = color;
        });
    }
}
export default CategoryGroup;
