import { fromLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';

export enum SiteTypes {
    Vesla,
    Mareograph,
}

export class Site {
    public id: number;
    public name: string;
    public depth: number | null;
    public type: SiteTypes;
    public lat: number;
    public long: number;
    public mapCoordinates: Coordinate;

    get displayName() {
        if (this.depth === null) {
            return this.name;
        }
        return `${this.name} (${this.depth}&nbsp;m)`;
    }

    constructor(id: number, name: string, lat: number, long: number, depth: number | null, type: SiteTypes) {
        this.id = id;
        this.name = name;
        this.depth = depth;
        this.type = type;
        this.lat = lat;
        this.long = long;
        this.mapCoordinates = fromLonLat([long, lat]);
    }
}
