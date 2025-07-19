import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";
import { calculateDistance, calculateRouteDistance, toRadians } from "@/utils/geoUtils";
class GPSService {
  constructor() {
    this.watchId = null;
    this.isWatching = false;
    this.isMobile = this.detectMobile();
    this.options = {
      enableHighAccuracy: true,
      timeout: this.isMobile ? 15000 : 10000, // Longer timeout for mobile
      maximumAge: this.isMobile ? 2000 : 1000, // Slightly longer cache for mobile
    };
    this.mobileOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // Extended timeout for mobile retry
      maximumAge: 5000,
    };
  }

  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad detection
  }

async getCurrentPosition(useExtendedTimeout = false) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      const options = useExtendedTimeout && this.isMobile ? this.mobileOptions : this.options;

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
              if (this.isMobile) {
                errorMessage = "Location access denied. On mobile devices:\n• iPhone: Settings > Privacy & Security > Location Services > Safari/Chrome\n• Android: Settings > Apps > Browser > Permissions > Location";
              } else {
                errorMessage = "Location access denied. Please enable location services in your browser settings and refresh the page.";
              }
              break;
            case error.POSITION_UNAVAILABLE:
              if (this.isMobile) {
                errorMessage = "GPS signal unavailable. Please ensure you're not indoors and have a clear view of the sky. On mobile, try turning location services off and on again.";
              } else {
                errorMessage = "Location information unavailable. Please check your device's location settings.";
              }
              break;
            case error.TIMEOUT:
              if (this.isMobile && !useExtendedTimeout) {
                // Don't immediately fail on mobile - we'll retry with extended timeout
                errorMessage = "GPS_TIMEOUT_RETRY";
              } else {
                errorMessage = "Location request timed out. Please ensure GPS is enabled and try again.";
              }
              break;
            default:
              errorMessage = "Unable to access location services. Please check your browser settings.";
              break;
          }
          reject(new Error(errorMessage));
        },
        options
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
            if (this.isMobile) {
              errorMessage = "Location access lost. On mobile devices:\n• iPhone: Settings > Privacy & Security > Location Services > Safari/Chrome\n• Android: Settings > Apps > Browser > Permissions > Location";
            } else {
              errorMessage = "Location access denied. Please enable location services in your browser settings and refresh the page.";
            }
            break;
          case error.POSITION_UNAVAILABLE:
            if (this.isMobile) {
              errorMessage = "GPS signal lost. Please ensure you have a clear view of the sky and stable internet connection.";
            } else {
              errorMessage = "Location information unavailable. Please check your device's location settings.";
            }
            break;
          case error.TIMEOUT:
            errorMessage = this.isMobile ? 
              "GPS signal weak. Please move to an area with better reception." :
              "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = "GPS tracking error. Please check your location settings.";
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
      // iOS Safari doesn't fully support Permissions API for geolocation
      const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      // Check if Permissions API is available and reliable
      if ('permissions' in navigator && !isIOSSafari) {
        try {
          const permission = await navigator.permissions.query({ name: "geolocation" });
          
          if (permission.state === "denied") {
            if (this.isMobile) {
              throw new Error("Location access denied. On mobile devices:\n• iPhone: Settings > Privacy & Security > Location Services > Safari/Chrome\n• Android: Settings > Apps > Browser > Permissions > Location\n\nAfter enabling, please refresh this page.");
            } else {
              throw new Error("Location access denied. Please enable location services in your browser settings and refresh the page.");
            }
          }
          
          if (permission.state === "granted") {
            return "granted";
          }
          
          // If prompt, try to trigger permission request with retry logic
          if (permission.state === "prompt") {
            try {
              await this.getCurrentPosition();
              return "granted";
            } catch (err) {
              if (err.message.includes("denied")) {
                if (this.isMobile) {
                  throw new Error("Location access denied. On mobile devices:\n• iPhone: Settings > Privacy & Security > Location Services > Safari/Chrome\n• Android: Settings > Apps > Browser > Permissions > Location\n\nAfter enabling, please refresh this page.");
                } else {
                  throw new Error("Location access denied. Please enable location services in your browser settings and refresh the page.");
                }
              }
              
              // Mobile timeout retry
              if (err.message === "GPS_TIMEOUT_RETRY" && this.isMobile) {
                try {
                  await this.getCurrentPosition(true); // Extended timeout
                  return "granted";
                } catch (retryErr) {
                  throw new Error("GPS acquisition failed. Please ensure location services are enabled and try moving to an area with better GPS reception.");
                }
              }
              
              throw new Error("Location permission required. Please allow location access when prompted.");
            }
          }
          
          return permission.state;
        } catch (permissionError) {
          // Fallback to direct geolocation for mobile browsers with unreliable Permission API
          if (this.isMobile) {
            return await this.mobilePermissionFallback();
          }
          throw permissionError;
        }
      }
      
      // Fallback for browsers without Permissions API or iOS Safari
      return await this.mobilePermissionFallback();
      
    } catch (error) {
      // Re-throw with context if it's already a meaningful error
      if (error.message.includes("Location") || error.message.includes("GPS")) {
        throw error;
      }
      
      // Generic fallback error
      throw new Error("Unable to access location services. Please check your browser settings and ensure location services are enabled.");
    }
  }

  async mobilePermissionFallback() {
    try {
      await this.getCurrentPosition();
      return "granted";
    } catch (err) {
      if (err.message.includes("denied")) {
        if (this.isMobile) {
          throw new Error("Location access denied. On mobile devices:\n• iPhone: Settings > Privacy & Security > Location Services > Safari/Chrome\n• Android: Settings > Apps > Browser > Permissions > Location\n\nAfter enabling, please refresh this page.");
        } else {
          throw new Error("Location access denied. Please enable location services in your browser settings and refresh the page.");
        }
      }
      
      // Mobile timeout retry
      if (err.message === "GPS_TIMEOUT_RETRY" && this.isMobile) {
        try {
          await this.getCurrentPosition(true); // Extended timeout
          return "granted";
        } catch (retryErr) {
          throw new Error("GPS acquisition failed. Please ensure location services are enabled and try moving to an area with better GPS reception.");
        }
      }
      
      throw new Error("Location permission required. Please allow location access when prompted.");
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