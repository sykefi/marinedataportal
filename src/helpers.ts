import { CommonParameters } from './queries/commonParameters';
import { Site } from './queries/site';
import { IAttributeModule } from './store/attributeModules/IAttributeModule';
import { DatePickerResult } from './components/common/datePicker/datePicker';
import { IFmiResult } from '@/apis/fmiApi';
import { IResponseFormat } from '@/queries/IResponseFormat';

/**
 * Splits an array into chunks of specified size
 * @param array the array to split
 * @param size the size of the resulting chunks
 */
export function chunkArray<T>(array: T[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) })
    .map((_, i) => Array.from({ length: size })
      .map((x, j) => array[i * size + j]));
}

/**
 * Builds an OData 4 'in' filter. Result example: key in (1,2,3).
 * Returns an empty string if the array is empty.
 * @param array the array containing the simple values to chain
 * @param variable the variable name
 * @param startWithAnd if this filter is not the first, set this true to add the 'and' to the start of the query
 */
export function buildODataInFilterFromArray(array: any[], variable: string, startWithAnd: boolean) {
  if (array.length === 0) {
    return '';
  }

  if (array.length === 1) {
    return (startWithAnd ? ' and' : '') + ` ${variable} eq ${array[0]}`;
  }

  let filter = startWithAnd ? ' and ' : '';
  filter += variable + ' in (';
  array.forEach((val) => {
    if (val) {
      filter += val + ',';
    }
  });

  filter = filter.substring(0, filter.length - 1);
  filter += ')';
  return filter;
}


export function validateSearchParameters(checkSites: boolean,
                                         selectedSites: Site[],
                                         selectedAttributeModules: IAttributeModule[],
                                         timeSpanStart: DatePickerResult,
                                         timeSpanEnd: DatePickerResult,
                                         periodStart: DatePickerResult,
                                         periodEnd: DatePickerResult) {
  const errors: string[] = [];

  if (checkSites && selectedSites.length === 0) {
    errors.push('$noSitesSelected');
  }

  // Attribute validation
  if (selectedAttributeModules.length === 0) {
    errors.push('$noAttributesSelected');
  }

  // Time span validation
  if (!timeSpanStart) {
    errors.push('$missingTimeSpanStart');
  }
  if (!timeSpanEnd) {
    errors.push('$missingTimeSpanEnd');
  } else if (timeSpanStart && timeSpanStart > timeSpanEnd) {
    errors.push('$timeSpanStartAfterTimeSpanEnd');
  }

  // Time period validation
  if (periodStart && !periodEnd) {
    errors.push('$missingPeriodEnd');
  } else if (!periodStart && periodEnd) {
    errors.push('$missingPeriodStart');
  } else if (periodStart && periodEnd) {
    if (periodStart === 'invalid') {
      errors.push('$incompletePeriodStart');
    }
    if (periodEnd === 'invalid') {
      errors.push('$incompletePeriodEnd');
    }
  }

  return errors;
}

export function alphabeticCompare(a: string, b: string) {
  return a.localeCompare(b);
}

export function cleanupTimePeriod(results: any[], params: CommonParameters) {
  return results.filter((r) => {
    // remove results that go over the specified time period
    const month = parseInt(r.time.substring(5, 7), 10);
    const day = parseInt(r.time.substring(8, 10), 10);
    return isDateInPeriod(month, day, params);
  });
}

export function isDateInPeriod(month: number, day: number, params: CommonParameters) {
  const startMonth = params.datePeriodMonths!.start;
  const endMonth = params.datePeriodMonths!.end;
  const startDay = params.datePeriodStartDay!;
  const endDay = params.datePeriodEndDay!;

  // case: time period stretches from a month to the same month on the next year
  // example: time period 1/31 - 1/15
  // allow results from months 2-12
  const almostYearPeriod = startMonth === endMonth && startDay > endDay;
  if (almostYearPeriod) {
    if (month > startMonth || month < startMonth) {
      return true;
    }
    // example: time period 3/21 - 6/19:
    // allow all results from months 4 - 5
  } else if (startMonth <= endMonth) {
    if (month > startMonth && month < endMonth) {
      return true;
    }
  } else {
    // example: time period 9/15 - 4/21
    // allow result from months 10 - 12 and 1 - 3
    if (month > startMonth || month < endMonth) {
      return true;
    }
  }

  // check the results days from start month and end month, discard those that cross the limits
  if (almostYearPeriod && month === startMonth) {
    return day >= startDay || day <= endDay;
  }
  if (month === startMonth && month === endMonth) {
    return day >= startDay && day <= endDay;
  }
  if (month === startMonth) {
    return day >= startDay;
  }
  if (month === endMonth) {
    return day <= endDay;
  }
}

export function getTimeParametersForVeslaFilter(params: CommonParameters) {
  let filter = ` and Time ge ${params.formattedDateStart}` +
    ` and Time le ${params.formattedDateEnd}`;

  if (params.datePeriodMonths) {
    if (params.datePeriodMonths.start > params.datePeriodMonths.end) {
      filter += ` and (month(Time) ge ${params.datePeriodMonths.start} or month(Time) le ${params.datePeriodMonths.end})`;
    } else {
      filter += ` and (month(Time) ge ${params.datePeriodMonths.start} and month(Time) le ${params.datePeriodMonths.end})`;
    }
  }

  if (params.datePeriodDays) {
    filter += buildODataInFilterFromArray(params.datePeriodDays, 'day(Time)', true);
  }

  return filter;
}

export function fromObservationToSykeFormat(obj: any): IResponseFormat {
  return {
    time: obj.time,
    analyteName: obj.parameterNameEng,
    value: obj.value.toString(),
    unit: obj.unit,
    siteId: obj.siteId,
    site: obj.siteName,
    siteLatitudeWGS84: obj.site.latitude,
    siteLongitudeWGS84: obj.site.longitude,
    siteDepthM: obj.site.depth.toString(),
    dataSource: obj.dataSource,
  };
}

export function toCommonFormat(obj: IFmiResult, analyteName: string, unit: string): IResponseFormat {
  return {
    time: obj.time,
    analyteName,
    value: obj.value,
    unit,
    siteId: obj.siteId,
    site: obj.siteName,
    siteLatitudeWGS84: obj.lat,
    siteLongitudeWGS84: obj.long,
    samplingLatitudeWGS84: null,
    samplingLongitudeWGS84: null,
    sampleDepthM: null,
    sampleDepthUpperM: null,
    sampleDepthLowerM: null,
    siteDepthM: null,
    totalDepthM: null,
    laboratory: null,
    dataSource: obj.dataSource,
  };
}

export function toFmiFormat(obj: IFmiResult, analyteName: string, unit: string): IResponseFormat {
  return {
    time: obj.time,
    analyteName,
    value: obj.value,
    unit,
    siteId: obj.siteId,
    site: obj.siteName,
    siteLatitudeWGS84: obj.lat,
    siteLongitudeWGS84: obj.long,
    dataSource: obj.dataSource,
  };
}
