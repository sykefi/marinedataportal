import { getSurfaceTemperatures } from '@/queries/getSurfaceTemperatureQuery';
import { getWaterLevels } from '@/queries/getWaterLevelQuery';

export const mapping = [
    { attribute: '$marineStations', function: getSurfaceTemperatures },
    { attribute: '$waterLevel', function: getWaterLevels },
];
