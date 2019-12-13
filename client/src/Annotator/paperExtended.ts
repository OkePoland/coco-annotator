import Paper from 'paper';

declare module 'paper' {
    export interface View {
        setCenter(x: number, y: number): void;
        setCenter(point: Paper.Point): void;
        getZoom(): number;
    }
}
export default Paper;
