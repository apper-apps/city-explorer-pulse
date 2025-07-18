import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { addTrip } from "@/store/slices/tripsSlice";
import { tripsService } from "@/services/api/tripsService";
import MapComponent from "@/components/organisms/MapContainer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const MapPage = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const trips = await tripsService.getAllTrips();
        trips.forEach(trip => {
          dispatch(addTrip(trip));
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [dispatch]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className={cn("h-full", className)} {...props}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("h-full", className)} {...props}>
        <Error message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("h-[calc(100vh-200px)]", className)}
      {...props}
    >
      <MapComponent className="w-full h-full rounded-xl shadow-lg" />
    </motion.div>
  );
};

export default MapPage;