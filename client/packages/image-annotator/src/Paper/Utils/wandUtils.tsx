import * as MagicWand from 'magic-wand-tool';
import paper from 'paper';

interface IGetPathProps {
    data: Uint8ClampedArray;
    x: number;
    y: number;
    width: number;
    height: number;
    threshold: number;
    blurRadius: number;
}
export const getPath = ({
    data,
    x,
    y,
    width,
    height,
    threshold,
    blurRadius,
}: IGetPathProps) => {
    const image = {
        data,
        width,
        height,
        bytes: 4,
    };
    const newRadius = blurRadius < 1 ? 1 : Math.abs(blurRadius);

    const floodMask = MagicWand.floodFill(image, x, y, threshold);
    const mask = MagicWand.gaussBlurOnlyBorder(floodMask, newRadius);

    const contours = MagicWand.traceContours(mask).filter(x => !x.inner);
    if (contours[0]) {
        const centerX = width / 2;
        const centerY = height / 2;
        const points = contours[0].points.map(pt => ({
            x: pt.x + 0.5 - centerX,
            y: pt.y + 0.5 - centerY,
        }));
        const polygon = new paper.Path(points);
        polygon.closed = true;
        return polygon;
    }
    return null;
};
