import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TrackingIndicator = ({ 
  isTracking, 
  currentSpeed = 0, 
  className,
  ...props 
}) => {
  const formatSpeed = (speed) => {
    if (speed === null || speed === undefined) return "0";
    // Convert from m/s to km/h if needed
    const kmh = typeof speed === "number" ? Math.round(speed * 3.6) : 0;
    return kmh.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <Badge 
        variant={isTracking ? "accent" : "default"}
        size="md"
        className="flex items-center gap-2"
      >
        <div className="relative">
          <ApperIcon 
            name={isTracking ? "Navigation" : "NavigationOff"} 
            className="w-4 h-4" 
          />
          {isTracking && (
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
        <span className="font-medium">
          {isTracking ? "Tracking" : "Stopped"}
        </span>
      </Badge>
      
      <Badge variant="default" size="md" className="flex items-center gap-1">
        <ApperIcon name="Gauge" className="w-4 h-4" />
        <span className="font-medium">
          {formatSpeed(currentSpeed)} km/h
        </span>
      </Badge>
    </motion.div>
  );
};

export default TrackingIndicator;