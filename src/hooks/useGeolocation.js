import { useState, useEffect, useCallback } from "react";
import { gpsService } from "@/services/api/gpsService";

export const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState(null);

  const getCurrentPosition = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const pos = await gpsService.getCurrentPosition();
      setPosition(pos);
      return pos;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const permissionState = await gpsService.requestPermission();
      setPermission(permissionState);
      return permissionState;
    } catch (err) {
      setError(err.message);
      setPermission("denied");
      throw err;
    }
  }, []);

  useEffect(() => {
    // Check permission and get initial position
    const initialize = async () => {
      try {
        const permissionState = await requestPermission();
        if (permissionState === "granted") {
          await getCurrentPosition();
        }
      } catch (err) {
        console.error("Failed to initialize geolocation:", err);
      }
    };

    initialize();
  }, [requestPermission, getCurrentPosition]);

  return {
    position,
    error,
    loading,
    permission,
    getCurrentPosition,
    requestPermission,
  };
};