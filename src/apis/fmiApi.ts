// tslint:disable:no-console
import { CommonParameters } from '@/queries/commonParameters';
import { Site } from '@/queries/site';
import { isDateInPeriod } from '@/helpers';

const QUERY_URL =
  'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0';

export interface IFmiResult {
  responseId: number;
  time: string;
  parameterName: string;
  value: string;
  lat: number;
  long: number;
  dataSource: string;
  siteName: string;
  siteId: number;
}

export async function GetRawXMLResponse(query: string) {
  return await getXmlResponse(QUERY_URL + query);
}

export async function GetSimpleFmiResponse(query: string, params: CommonParameters, sites: Site[]) {
  const numberOfDaysInSingleQuery = 6;
  const dateSpans = getDates(params, numberOfDaysInSingleQuery);
  const results: IFmiResult[] = [];

  if (!dateSpans) {
    return results;
  }

  // FMI API sends one XML entry per parameter. However, the results of a single measurement are grouped by a common id.
  // lastResponseId is used to keep track of iterations, so we can get the id for all results accross different queries
  let lastResponseId = 0;
  for (const site of sites) {
    for (let i = 0; i < dateSpans.length - 1; i++) {
      const startDate = new Date(dateSpans[i].getTime());
      if (i > 0) {
        // Start date was already handled in the previous query
        addDay(startDate);
      }
      startDate.setUTCHours(0);
      startDate.setUTCMinutes(0);
      startDate.setUTCSeconds(0);

      const endDate = new Date(dateSpans[i + 1].getTime());
      endDate.setUTCHours(23);
      endDate.setUTCMinutes(59);
      endDate.setUTCSeconds(59);

      // For example, if chosen time span is May 1 - May 7, dateSpans array will contain dates May 1 and May 7.
      // In this case getDateSpanLengthInDays will return 7 which is > 6, but we don't want to skip it.
      if (getDateSpanLengthInDays(startDate, endDate) > numberOfDaysInSingleQuery + 1) {
        // in multi-year queries with time period selection, there are gaps in the days
        // these gaps will be skipped, and the start of the gap is processed on the next iteration
        continue;
      }

      const res = (await getXmlResponse(QUERY_URL + query + formatParams(startDate, endDate, site.id)));
      const elements = res.getElementsByTagName('BsWfs:BsWfsElement');
      results.push(...parseSimpleResponse(Array.from(elements), site, lastResponseId));
      if (results.length) {
        lastResponseId = results[results.length - 1].responseId;
      }
    }
  }
  return results;
}

function parseSimpleResponse(elements: Element[], site: Site, lastResponseId: number) {
  const results: IFmiResult[] = [];
  for (const element of elements) {
    const time = element.getElementsByTagName('BsWfs:Time')[0].firstChild!.nodeValue!;
    const parameterName = element.getElementsByTagName('BsWfs:ParameterName')[0].firstChild!.nodeValue!;
    const value = element.getElementsByTagName('BsWfs:ParameterValue')[0].firstChild!.nodeValue!;
    const result: IFmiResult = {
      responseId: lastResponseId + (+element.attributes[0].nodeValue!.split('.')[2]),
      time: new Date(time).toISOString(),
      parameterName,
      value,
      lat: site.lat,
      long: site.long,
      siteId: site.id,
      siteName: site.name,
      dataSource: 'FMI',
    };
    results.push(result);
  }
  console.log(results);
  return results;
}

function formatParams(dateStart: Date, dateEnd: Date, siteId: number) {
  let s = '';
  s += '&starttime=' + dateStart.toISOString();
  s += '&endtime=' + dateEnd.toISOString();
  s += '&fmisid=' + siteId;

  return s;
}

async function getXmlResponse(url: string) {
  return new Promise<Document>((resolve: any, reject: any) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    console.log(url);
    xhr.responseType = 'text';
    xhr.onload = () => {
      const status = xhr.status;
      if (status === 200) {
        const oParser = new DOMParser();
        const oDOM = oParser.parseFromString(xhr.response, 'application/xml');
        console.log(oDOM);
        resolve(oDOM);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
}

/** Get all the dates between a start and an end date
 * @param blockSizeDays How to split the time range, in number of days. Example: to get a range of weeks, size is 7
 */
function getDates(params: CommonParameters, blockSizeDays: number) {
  let dateArray: Date[] = [];
  let currentDate = new Date(params.dateStart.getTime());
  while (currentDate <= params.dateEnd) {
    dateArray.push(new Date(currentDate.getTime()));
    if (params.datePeriodStartDay === params.datePeriodEndDay) {
      // If only one date is queried, it will serve as end date as well
      dateArray.push(new Date(currentDate.getTime()));
    }
    currentDate = addDay(currentDate);
  }

  if (params.datePeriodMonths) {
    dateArray = dateArray.filter(checkDatePeriod);
  }
  if (dateArray.length === 0) {
    return;
  }

  const filtered: Date[] = [];
  filtered.push(dateArray[0]);

  for (let i = 0; i < dateArray.length; i += 1) {
    const previousLast = filtered[filtered.length - 1];
    // goal here is to get a list of dates that are <= `timeSpan` away from each other
    // this is done so we can build queries with a maximum number of days to reduce the number of queries
    if (i === dateArray.length - 1) {
      filtered.push(dateArray[i]);
    } else {
      const nextInRange = getDateSpanLengthInDays(previousLast, dateArray[i + 1]) <= blockSizeDays;
      if (!nextInRange) {
        filtered.push(dateArray[i]);
      }
      // current iterable and the next one are in range, skip this and proceed to next date
    }
  }

  if (!filtered.includes(params.dateEnd) && (!params.datePeriodMonths || checkDatePeriod(params.dateEnd))) {
    filtered.push(params.dateEnd);
  }

  return filtered;

  function checkDatePeriod(date: Date) {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return isDateInPeriod(month, day, params);
  }
}

function addDay(date: Date) {
  date.setDate(date.getDate() + 1);
  return date;
}

function getDateSpanLengthInDays(startDate: Date, endDate: Date) {
  const differenceInTime = endDate.getTime() - startDate.getTime();
  return Math.round(differenceInTime / (1000 * 3600 * 24));
}
