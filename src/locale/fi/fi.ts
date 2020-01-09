import attributeSelection from './attributeSelectionFi';
import timeSpanSelection from './timeSpanSelectionFi';
import siteSelection from './siteSelectionFi';
import fileDownload from './dataDownloadFi';
import surgeDetails from './surgeDetailsFi';
import temperatureDetails from './temperatureDetailsFi';
import waterQualityDetails from './waterQualityDetailsFi';
import general from './generalFi';
import footer from './footerFi';
export default {
    ...attributeSelection,
    ...timeSpanSelection,
    ...siteSelection,
    ...fileDownload,
    ...surgeDetails,
    ...temperatureDetails,
    ...waterQualityDetails,
    ...general,
    ...footer,
};
