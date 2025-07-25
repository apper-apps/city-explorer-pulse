import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import TrackingIndicator from "@/components/molecules/TrackingIndicator";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { tripsService } from "@/services/api/tripsService";
import { gpsService } from "@/services/api/gpsService";
import { calculateRouteDistance } from "@/utils/geoUtils";
import { cn } from "@/utils/cn";
import { addTrip } from "@/store/slices/tripsSlice";
import { clearSession, startTracking, stopTracking, updatePosition } from "@/store/slices/trackingSlice";

const TrackingControls = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const { isActive, currentPosition, currentSpeed, sessionRoute } = useSelector(state => state.tracking);
  const [isInitializing, setIsInitializing] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  useEffect(() => {
    let watchId = null;

    if (isActive) {
      const handlePositionUpdate = (position) => {
        dispatch(updatePosition({ position, speed: position.speed }));
      };

      const handleError = (error) => {
        console.error("GPS error:", error);
        toast.error(`GPS Error: ${error.message}`);
      };

      gpsService.startWatching(handlePositionUpdate, handleError);
    } else {
      gpsService.stopWatching();
    }

    return () => {
      gpsService.stopWatching();
    };
  }, [isActive, dispatch]);
const handleStartTracking = async () => {
  setIsInitializing(true);
  try {
    // Check location permission first
      const permissionStatus = await gpsService.requestPermission();
      
      if (permissionStatus === "denied") {
        toast.error("Location access denied. Please enable location services in your browser settings and refresh the page.", {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      
      if (permissionStatus === "prompt") {
        toast.info("Please allow location access when prompted to start tracking.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }
      
      // Get initial position
      const position = await gpsService.getCurrentPosition();
      
      // Start tracking
      dispatch(startTracking());
      dispatch(updatePosition({ position, speed: position.speed }));
      setSessionStartTime(Date.now());
      
      toast.success("GPS tracking started successfully");
} catch (error) {
      console.error("Failed to start tracking:", error);
      
      // Provide specific guidance based on error type
      if (error.message.includes("denied") || error.message.includes("permission")) {
        toast.error(
          error.message, 
          { 
            autoClose: 12000, // Longer for mobile instruction reading
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else if (error.message.includes("unavailable") || error.message.includes("GPS signal")) {
        toast.error(error.message, {
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (error.message.includes("timeout") || error.message.includes("GPS acquisition failed")) {
        toast.error(error.message, {
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (error.message.includes("GPS reception")) {
        toast.warning("Poor GPS signal. Try moving to an open area away from buildings and try again.", {
          autoClose: 6000,
        });
      } else {
        toast.error(`Failed to start tracking: ${error.message}`);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const handleStopTracking = async () => {
    if (sessionRoute.length > 1 && sessionStartTime) {
      try {
        // Create trip from session data
        const tripData = {
          startTime: sessionStartTime,
          endTime: Date.now(),
          route: sessionRoute,
        };

        const newTrip = await tripsService.createTrip(tripData);
        dispatch(addTrip(newTrip));
        
        toast.success(`Trip saved: ${newTrip.distance.toFixed(1)} km`);
      } catch (error) {
        console.error("Failed to save trip:", error);
        toast.error("Failed to save trip");
      }
    }

    dispatch(stopTracking());
    dispatch(clearSession());
    setSessionStartTime(null);
    gpsService.stopWatching();
    
    toast.info("GPS tracking stopped");
  };

  const handleClearSession = () => {
    dispatch(clearSession());
    setSessionStartTime(Date.now());
    toast.info("Session cleared");
  };

  const formatSessionDistance = () => {
    if (sessionRoute.length < 2) return "0.0 km";
    const distance = gpsService.calculateRouteDistance(sessionRoute);
    return `${distance.toFixed(1)} km`;
  };

  const formatSessionTime = () => {
    if (!sessionStartTime) return "0:00";
    const elapsed = Date.now() - sessionStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("", className)} {...props}>
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary-900">
            GPS Tracking
          </h2>
          <TrackingIndicator 
            isTracking={isActive} 
            currentSpeed={currentSpeed}
          />
        </div>

        {/* Session Stats */}
        {(isActive || sessionRoute.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-700">
                {formatSessionDistance()}
              </div>
              <div className="text-sm text-secondary-600">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-700">
                {formatSessionTime()}
              </div>
              <div className="text-sm text-secondary-600">Duration</div>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {!isActive ? (
            <Button
              onClick={handleStartTracking}
              disabled={isInitializing}
              className="flex-1"
              variant="primary"
            >
              {isInitializing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <ApperIcon name="Play" className="w-4 h-4" />
                  Start Tracking
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleStopTracking}
              className="flex-1"
              variant="danger"
            >
              <ApperIcon name="Square" className="w-4 h-4" />
              Stop & Save
            </Button>
          )}

          {sessionRoute.length > 0 && (
            <Button
              onClick={handleClearSession}
              variant="outline"
              disabled={isActive}
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Status */}
        <div className="text-sm text-secondary-600 text-center">
          {!isActive && sessionRoute.length === 0 && (
            "Press 'Start Tracking' to begin recording your route"
          )}
          {isActive && (
            "Tracking active - your route is being recorded"
          )}
          {!isActive && sessionRoute.length > 0 && (
            "Press 'Start Tracking' to resume or 'Stop & Save' to save this trip"
          )}
        </div>
      </Card>
    </div>
  );
};

export default TrackingControls;