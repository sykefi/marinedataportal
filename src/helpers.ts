/**
 * Splits an array into chunks of specified size
 * @param array the array to split
 * @param size the size of the resulting chunks
 */
export function chunkArray(array: any[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) })
    .map((_, i) => Array.from({ length: size })
      .map((x, j) => array[i * size + j]));
}
