export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

export const toDegrees = (radians) => {
  return radians * (180 / Math.PI);
};

export const calculateRouteDistance = (route) => {
  if (!route || route.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 1; i < route.length; i++) {
    const prev = route[i - 1];
    const curr = route[i];
    totalDistance += calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
  }
  return totalDistance;
};

export const calculateBounds = (points) => {
  if (!points || points.length === 0) return null;
  
  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;
  
  points.forEach(point => {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  });
  
  return {
    north: maxLat,
    south: minLat,
    east: maxLng,
    west: minLng,
  };
};

export const calculateCenter = (points) => {
  if (!points || points.length === 0) return null;
  
  const bounds = calculateBounds(points);
  if (!bounds) return null;
  
  return {
    lat: (bounds.north + bounds.south) / 2,
    lng: (bounds.east + bounds.west) / 2,
  };
};

export const formatCoordinates = (lat, lng, precision = 4) => {
  const formatDegrees = (deg) => {
    const abs = Math.abs(deg);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = ((abs - degrees) * 60 - minutes) * 60;
    return `${degrees}°${minutes}'${seconds.toFixed(precision)}"`;
  };
  
  const latStr = formatDegrees(lat) + (lat >= 0 ? 'N' : 'S');
  const lngStr = formatDegrees(lng) + (lng >= 0 ? 'E' : 'W');
  
  return `${latStr} ${lngStr}`;
};

export const isValidCoordinate = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
};

export const simplifyRoute = (route, tolerance = 0.0001) => {
  if (!route || route.length < 3) return route;
  
  // Simple Douglas-Peucker algorithm implementation
  const simplified = [route[0]];
  
  for (let i = 1; i < route.length - 1; i++) {
    const prev = route[i - 1];
    const curr = route[i];
    const next = route[i + 1];
    
    // Calculate perpendicular distance from current point to line between prev and next
    const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    
    if (distance > tolerance) {
      simplified.push(curr);
    }
  }
  
  simplified.push(route[route.length - 1]);
  return simplified;
};