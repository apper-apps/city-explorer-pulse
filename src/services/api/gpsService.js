import { toast } from "react-toastify";

class GPSService {
  constructor() {
    this.watchId = null;
    this.isWatching = false;
    this.options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
    };
  }

  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            speed: position.coords.speed,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          let errorMessage = "Unable to retrieve location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
            default:
              errorMessage = "An unknown error occurred";
              break;
          }
          reject(new Error(errorMessage));
        },
        this.options
      );
    });
  }

  startWatching(onPositionUpdate, onError) {
    if (this.isWatching) {
      return;
    }

    if (!navigator.geolocation) {
      const error = new Error("Geolocation is not supported by this browser");
      onError(error);
      return;
    }

    this.isWatching = true;
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          speed: position.coords.speed,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        onPositionUpdate(locationData);
      },
      (error) => {
        let errorMessage = "GPS tracking error";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "GPS tracking error";
            break;
        }
        onError(new Error(errorMessage));
      },
      this.options
    );
  }

  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isWatching = false;
    }
  }

  async requestPermission() {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "denied") {
        throw new Error("Location permission denied");
      }
      return permission.state;
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      try {
        await this.getCurrentPosition();
        return "granted";
      } catch (err) {
        throw new Error("Location permission required");
      }
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  calculateRouteDistance(route) {
    if (!route || route.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < route.length; i++) {
      const prev = route[i - 1];
      const curr = route[i];
      totalDistance += this.calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    }
    return totalDistance;
  }
}

export const gpsService = new GPSService();