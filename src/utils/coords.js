// normalize polygon coords into an array of [lat,lng] pairs
export function extractLatLngsFromPolygon(polygon) {
  if (!polygon || !Array.isArray(polygon.coordinates)) return [];

  // try to find the innermost array of [lng, lat] pairs
  let arr = polygon.coordinates;

  // flatten until we reach pairs of numbers
  while (Array.isArray(arr) && arr.length && Array.isArray(arr[0])) {
    arr = arr[0];
    // break if the elements look like numbers
    if (arr.length && typeof arr[0] === "number") break;
  }

  // at this point arr should be something like [[lng,lat], [lng,lat], ...]
  const pairs = Array.isArray(arr) && typeof arr[0] === "number" ? arr : arr;

  // ensure we map to [lat, lng]
  return pairs.map((p) => {
    // defensive: if point nested one level deeper
    const point = Array.isArray(p) && typeof p[0] === "number" && typeof p[1] === "number"
      ? p
      : (Array.isArray(p) && Array.isArray(p[0]) ? p[0] : null);

    if (!point) return null;
    const [lng, lat] = point;
    return [lat, lng];
  }).filter(Boolean);
}
