import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import L from "leaflet";
import { cn } from "@/utils/cn";
import { selectTrip } from "@/store/slices/tripsSlice";
import { updatePosition } from "@/store/slices/trackingSlice";
import { gpsService } from "@/services/api/gpsService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const TripOverlay = ({ trip, isSelected, onTripClick }) => {
  const polylineRef = useRef(null);

  const handleClick = () => {
    onTripClick(trip);
  };

  if (!trip.route || trip.route.length < 2) return null;

  const positions = trip.route.map(point => [point.lat, point.lng]);

  return (
    <>
      <Polyline
        ref={polylineRef}
        positions={positions}
        color={trip.color}
        weight={isSelected ? 6 : 4}
        opacity={isSelected ? 0.9 : 0.7}
        eventHandlers={{
          click: handleClick,
        }}
        className="trip-overlay cursor-pointer"
      />
      
      {/* Start marker */}
      <Marker position={positions[0]} eventHandlers={{ click: handleClick }}>
        <Popup>
          <div className="text-sm">
            <div className="font-semibold mb-1">Trip Start</div>
            <div className="text-secondary-600">
              {new Date(trip.startTime).toLocaleDateString()} at{" "}
              {new Date(trip.startTime).toLocaleTimeString()}
            </div>
          </div>
        </Popup>
      </Marker>

      {/* End marker */}
      <Marker position={positions[positions.length - 1]} eventHandlers={{ click: handleClick }}>
        <Popup>
          <div className="text-sm">
            <div className="font-semibold mb-1">Trip End</div>
            <div className="text-secondary-600">
              {new Date(trip.endTime).toLocaleDateString()} at{" "}
              {new Date(trip.endTime).toLocaleTimeString()}
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
};

const CurrentLocationMarker = ({ position, isTracking }) => {
  if (!position) return null;

  // Create custom icon for current location
  const currentLocationIcon = L.divIcon({
    html: `
      <div class="relative">
        <div class="w-6 h-6 bg-accent-500 rounded-full border-2 border-white shadow-lg ${isTracking ? 'animate-pulse' : ''}"></div>
        ${isTracking ? '<div class="absolute inset-0 w-6 h-6 bg-accent-500 rounded-full animate-ping opacity-75"></div>' : ''}
      </div>
    `,
    className: "current-location-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <Marker position={[position.lat, position.lng]} icon={currentLocationIcon}>
      <Popup>
        <div className="text-sm">
          <div className="font-semibold mb-1">Current Location</div>
          <div className="text-secondary-600">
            {isTracking ? "Tracking active" : "GPS location"}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const MapComponent = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [mapZoom, setMapZoom] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  const { filteredTrips, selectedTrip } = useSelector(state => state.trips);
  const { currentPosition, isActive } = useSelector(state => state.tracking);

  useEffect(() => {
    // Get user's current location on mount
    const getCurrentLocation = async () => {
      try {
        const position = await gpsService.getCurrentPosition();
        setMapCenter([position.lat, position.lng]);
        dispatch(updatePosition({ position, speed: position.speed }));
      } catch (error) {
        console.warn("Could not get current location:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentLocation();
  }, [dispatch]);

  const handleTripClick = (trip) => {
    dispatch(selectTrip(trip.id === selectedTrip?.id ? null : trip));
  };

  const handleMapClick = () => {
    if (selectedTrip) {
      dispatch(selectTrip(null));
    }
  };

  if (isLoading) {
    return (
      <div className={cn("relative", className)} {...props}>
        <Card className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-secondary-600">Loading map...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} {...props}>
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full"
        eventHandlers={{
          click: handleMapClick,
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        
        {/* Current location marker */}
        <CurrentLocationMarker position={currentPosition} isTracking={isActive} />
        
        {/* Trip overlays */}
        {filteredTrips.map(trip => (
          <TripOverlay
            key={trip.id}
            trip={trip}
            isSelected={selectedTrip?.id === trip.id}
            onTripClick={handleTripClick}
          />
        ))}
      </MapContainer>

      {/* Map controls overlay */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="map-controls p-2 flex items-center gap-2">
            <ApperIcon name="Map" className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-secondary-800">
              {filteredTrips.length} trips visible
            </span>
          </Card>
        </motion.div>
        
        {selectedTrip && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="map-controls p-3 max-w-[250px]">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="accent" size="sm">Selected</Badge>
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: selectedTrip.color }}
                />
              </div>
              <div className="text-sm space-y-1">
                <div className="font-medium text-secondary-900">
                  {selectedTrip.distance.toFixed(1)} km
                </div>
                <div className="text-secondary-600">
                  {new Date(selectedTrip.startTime).toLocaleDateString()}
                </div>
                <div className="text-secondary-600">
                  {Math.round(selectedTrip.duration / 60000)} minutes
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;