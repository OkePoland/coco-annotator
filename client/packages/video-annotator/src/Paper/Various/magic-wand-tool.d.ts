/**
 * types defintion for magic-wand-tool library
 */

declare module 'magic-wand-tool' {
    export interface Mask {
        data: number[];
        width: number;
        height: number;
        bounds: Object;
    }

    export interface ImageData {
        data: Uint8ClampedArray;
        width: number; 
        height: number;
        bytes: number;
    }

    export interface Point {
        x: number;
        y: number;
    }

    export interface Contour {
        points: Point[];
        inner: boolean;
        label: number;
    }

    export function floodFill(image: ImageData, px: number, py: number, colorThreshold: number): Mask;
    
    export function gaussBlurOnlyBorder(mask: Mask, radius: number, visited?: number[]): Mask;
    
    export function traceContours(mask: Mask) : Contour[];
}