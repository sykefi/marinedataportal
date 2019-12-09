import { mainState } from './store/mainState';
import { searchParameterModule, DepthOptions } from './store/searchParameterModule';
import { CommonParameters } from './queries/commonParameters';

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


export function validateSearchParameters(checkSites: boolean) {
  const errors: string[] = [];

  if (checkSites && searchParameterModule.selectedSites.length === 0) {
    errors.push('$noSitesSelected');
  }

  // Attribute validation
  if (mainState.selectedAttributeModules.length === 0) {
    errors.push('$noAttributesSelected');
  }

  const params = searchParameterModule;
  // Time span validation
  if (!params.timeSpanStart) {
    errors.push('$missingTimeSpanStart');
  }
  if (!params.timeSpanEnd) {
    errors.push('$missingTimeSpanEnd');
  } else if (params.timeSpanStart && params.timeSpanStart > params.timeSpanEnd) {
    errors.push('$timeSpanStartAfterTimeSpanEnd');
  }

  // Time period validation
  if (params.periodStart && !params.periodEnd) {
    errors.push('$missingPeriodEnd');
  } else if (!params.periodStart && params.periodEnd) {
    errors.push('$missingPeriodStart');
  } else if (params.periodStart && params.periodEnd) {
    if (!params.periodStart.isValid) {
      errors.push('$incompletePeriodStart');
    }
    if (!params.periodEnd.isValid) {
      errors.push('$incompletePeriodEnd');
    }
  }

  // Depth validation
  if (params.selectedDepth === DepthOptions.DepthInterval) {
    if (params.depthStart === null) {
      errors.push('$missingDepthStart');
    }
    if (params.depthEnd === null) {
      errors.push('$missingDepthEnd');
    } else if (params.depthStart && (params.depthStart >= params.depthEnd)) {
      errors.push('$depthStartGreaterThanDepthEnd');
    }
  }

  mainState.setErrorList(errors);
  return errors.length === 0;
}

export function alphabeticCompare(a: string, b: string) {
  return a.localeCompare(b);
}

export function cleanupTimePeriod(results: any[], params: CommonParameters) {
  const startMonth = params.datePeriodMonths!.start;
  const endMonth = params.datePeriodMonths!.end;

  return results.filter((r) => {
    // remove results that go over the specified time period
    // example: time period 3/21 - 6/19:
    // first allow all results from months 4 - 5
    // check the results days from months 3 and 6, discard those that cross the limits
    const month = parseInt(r.time.substring(5, 7), 10);
    if (startMonth <= endMonth) {
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
    const day = parseInt(r.time.substring(8, 10), 10);
    if (month === startMonth) {
      return day >= params.datePeriodStartDay!;
    }
    if (month === endMonth) {
      return day <= params.datePeriodEndDay!;
    }
  });
}
