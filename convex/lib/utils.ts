/**
 * asyncMapWithIndex returns the results of applying an async function over an list.
 *
 * @param list - Iterable object of items, e.g. an Array, Set, Object.keys
 * @param asyncTransform
 * @returns
 */
export async function asyncMapWithIndex<FromType, ToType>(
  list: Iterable<FromType>,
  asyncTransform: (item: FromType, index: number) => Promise<ToType>
): Promise<ToType[]> {
  const promises: Promise<ToType>[] = [];
  let index = 0;
  for (const item of list) {
    promises.push(asyncTransform(item, index));
    index++;
  }
  return Promise.all(promises);
}
