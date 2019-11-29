import { fromLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';

export class Site {
    public id: number;
    public name: string;
    public depth: number | null;
    public mapCoordinates: Coordinate;

    get displayName() {
        if (this.depth === null) {
            return this.name;
        }
        return `${this.name} (${this.depth}&nbsp;m)`;
    }

    constructor(id: number, name: string, lat: number, long: number, depth: number | null) {
        this.id = id;
        this.name = name;
        this.depth = depth;
        this.mapCoordinates = fromLonLat([long, lat]);
    }
}
