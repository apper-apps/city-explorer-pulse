import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import StatCard from "@/components/molecules/StatCard";

const StatsHeader = ({ className, ...props }) => {
  const { stats, filteredTrips } = useSelector(state => state.trips);

  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}k km`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const formatCoverage = (explored, total) => {
    const percentage = total > 0 ? (explored / total) * 100 : 0;
    return `${percentage.toFixed(1)}%`;
  };

  const filteredStats = {
    totalDistance: filteredTrips.reduce((sum, trip) => sum + trip.distance, 0),
    totalTrips: filteredTrips.length,
    exploredGridCells: stats.exploredGridCells,
    totalGridCells: stats.totalGridCells,
  };

  return (
    <div className={cn("", className)} {...props}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatCard
            title="Total Distance"
            value={formatDistance(filteredStats.totalDistance)}
            icon="Route"
            gradient
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatCard
            title="Total Trips"
            value={filteredStats.totalTrips.toString()}
            icon="MapPin"
            gradient
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatCard
            title="City Coverage"
            value={formatCoverage(filteredStats.exploredGridCells, filteredStats.totalGridCells)}
            icon="Map"
            gradient
          />
        </motion.div>
      </div>
    </div>
  );
};

export default StatsHeader;