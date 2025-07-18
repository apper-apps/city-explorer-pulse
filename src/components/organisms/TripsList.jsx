import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { selectTrip } from "@/store/slices/tripsSlice";
import { tripsService } from "@/services/api/tripsService";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const TripItem = ({ trip, isSelected, onTripClick }) => {
  const formatDuration = (ms) => {
    const minutes = Math.round(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={cn(
          "p-4 cursor-pointer transition-all duration-200 hover:shadow-lg",
          isSelected && "ring-2 ring-primary-500 bg-primary-50"
        )}
        onClick={() => onTripClick(trip)}
      >
        <div className="flex items-start gap-3">
          {/* Trip color indicator */}
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0 mt-1 border-2 border-white shadow-sm"
            style={{ backgroundColor: trip.color }}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-secondary-900">
                {trip.distance.toFixed(1)} km
              </h3>
              <Badge variant="default" size="sm">
                {formatDuration(trip.duration)}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm text-secondary-600">
              <div className="flex items-center gap-1">
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>{formatDate(trip.startTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Clock" className="w-3 h-3" />
                <span>{formatTime(trip.startTime)} - {formatTime(trip.endTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Gauge" className="w-3 h-3" />
                <span>{trip.averageSpeed.toFixed(1)} km/h avg</span>
              </div>
            </div>
          </div>
          
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name="Check" className="w-5 h-5 text-primary-600 flex-shrink-0" />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const TripsList = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const { filteredTrips, selectedTrip } = useSelector(state => state.trips);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTripClick = (trip) => {
    dispatch(selectTrip(trip.id === selectedTrip?.id ? null : trip));
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className={cn("", className)} {...props}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("", className)} {...props}>
        <Error message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (filteredTrips.length === 0) {
    return (
      <div className={cn("", className)} {...props}>
        <Empty 
          title="No trips found"
          description="Start driving to record your first trip, or adjust your date range to view different periods."
          icon="Route"
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-secondary-900">
          Recent Trips
        </h2>
        <Badge variant="primary" size="sm">
          {filteredTrips.length} trips
        </Badge>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {filteredTrips.map(trip => (
            <TripItem
              key={trip.id}
              trip={trip}
              isSelected={selectedTrip?.id === trip.id}
              onTripClick={handleTripClick}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TripsList;