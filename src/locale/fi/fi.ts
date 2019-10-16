import attributeSelection from './attributeSelectionFi';
import timeSpanSelection from './timeSpanSelectionFi';
import siteSelection from './siteSelectionFi';
import fileDownload from './fileDownloadFi';
export default {
    ...attributeSelection,
    ...timeSpanSelection,
    ...siteSelection,
    ...fileDownload,
};
