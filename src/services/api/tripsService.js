import { gpsService } from "@/services/api/gpsService";

class TripsService {
  constructor() {
    this.trips = JSON.parse(localStorage.getItem("cityExplorerTrips")) || [];
    this.colors = [
      "#5E4FDB", "#00D9FF", "#00B894", "#E74C3C", "#74B9FF", 
      "#FDCB6E", "#A29BFE", "#FF7675", "#00CEC9", "#FD79A8"
    ];
  }

  async getAllTrips() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.trips]);
      }, 200);
    });
  }

  async getTripById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trip = this.trips.find(t => t.id === id);
        resolve(trip ? { ...trip } : null);
      }, 150);
    });
  }

  async createTrip(tripData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrip = {
          id: Date.now().toString(),
          startTime: tripData.startTime,
          endTime: tripData.endTime,
          distance: gpsService.calculateRouteDistance(tripData.route),
          route: [...tripData.route],
          color: this.colors[this.trips.length % this.colors.length],
          duration: tripData.endTime - tripData.startTime,
          averageSpeed: this.calculateAverageSpeed(tripData.route, tripData.endTime - tripData.startTime),
          ...tripData,
        };
        
        this.trips.push(newTrip);
        this.saveToLocalStorage();
        resolve({ ...newTrip });
      }, 300);
    });
  }

  async updateTrip(id, updateData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.trips.findIndex(t => t.id === id);
        if (index !== -1) {
          this.trips[index] = { ...this.trips[index], ...updateData };
          this.saveToLocalStorage();
          resolve({ ...this.trips[index] });
        } else {
          resolve(null);
        }
      }, 250);
    });
  }

  async deleteTrip(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.trips.findIndex(t => t.id === id);
        if (index !== -1) {
          const deletedTrip = this.trips.splice(index, 1)[0];
          this.saveToLocalStorage();
          resolve({ ...deletedTrip });
        } else {
          resolve(null);
        }
      }, 200);
    });
  }

  async getTripsByDateRange(startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.trips.filter(trip => {
          const tripDate = new Date(trip.startTime);
          return tripDate >= startDate && tripDate <= endDate;
        });
        resolve(filtered.map(trip => ({ ...trip })));
      }, 200);
    });
  }

  async clearAllTrips() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.trips = [];
        this.saveToLocalStorage();
        resolve(true);
      }, 200);
    });
  }

  calculateAverageSpeed(route, durationMs) {
    if (!route || route.length < 2 || durationMs <= 0) return 0;
    
    const distance = gpsService.calculateRouteDistance(route);
    const durationHours = durationMs / (1000 * 60 * 60);
    return distance / durationHours;
  }

  calculateCoverageStats(trips) {
    const gridSize = 100; // 100x100 grid
    const exploredCells = new Set();
    
    trips.forEach(trip => {
      if (trip.route && trip.route.length > 0) {
        trip.route.forEach(point => {
          // Simple grid cell calculation - this would need proper bounds in real app
          const cellX = Math.floor((point.lng + 180) * gridSize / 360);
          const cellY = Math.floor((point.lat + 90) * gridSize / 180);
          exploredCells.add(`${cellX},${cellY}`);
        });
      }
    });

    return {
      totalDistance: trips.reduce((sum, trip) => sum + trip.distance, 0),
      totalTrips: trips.length,
      exploredGridCells: exploredCells.size,
      totalGridCells: gridSize * gridSize,
      coveragePercentage: (exploredCells.size / (gridSize * gridSize)) * 100,
    };
  }

  saveToLocalStorage() {
    localStorage.setItem("cityExplorerTrips", JSON.stringify(this.trips));
  }

  getRouteColors() {
    return [...this.colors];
  }
}

export const tripsService = new TripsService();