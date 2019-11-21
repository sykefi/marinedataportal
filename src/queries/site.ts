import { fromLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';

export class Site {
    public id: number;
    public name: string;
    public lat: number;
    public long: number;
    public mapCoordinates: Coordinate;
    constructor(id: number, name: string, lat: number, long: number) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.long = long;
        this.mapCoordinates = fromLonLat([long, lat]);
    }
}
