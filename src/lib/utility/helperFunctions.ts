export function mapToJson(map: Map<any, any>): any {
  return Array.from(map.entries()).reduce((obj, [key, value]) => {
    obj[key] = value instanceof Map ? mapToJson(value) : value;
    return obj;
  }, {});
}
