import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import TrackingControls from "@/components/organisms/TrackingControls";
import TripsList from "@/components/organisms/TripsList";
import DateRangePicker from "@/components/molecules/DateRangePicker";
import { useSelector, useDispatch } from "react-redux";
import { setDateRange } from "@/store/slices/tripsSlice";

const Sidebar = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const { dateRange } = useSelector(state => state.trips);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDateChange = (start, end) => {
    dispatch(setDateRange({ start, end }));
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:block w-80 bg-background border-r border-secondary-200 flex-shrink-0",
        className
      )} {...props}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Navigation" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-900">City Explorer</h1>
                <p className="text-sm text-secondary-600">GPS Tracking</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <TrackingControls />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Filter Trips</h3>
              <DateRangePicker
                startDate={dateRange.start}
                endDate={dateRange.end}
                onDateChange={handleDateChange}
              />
            </div>

            <TripsList />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Mobile Toggle Button */}
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="secondary"
          className="fixed top-4 left-4 z-[1001] shadow-lg"
        >
          <ApperIcon name={isCollapsed ? "Menu" : "X"} className="w-5 h-5" />
        </Button>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {!isCollapsed && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-[1000] lg:hidden"
                onClick={() => setIsCollapsed(true)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed left-0 top-0 h-full w-80 bg-background shadow-2xl z-[1001] lg:hidden"
              >
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="p-6 border-b border-secondary-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                          <ApperIcon name="Navigation" className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h1 className="text-xl font-bold text-secondary-900">City Explorer</h1>
                          <p className="text-sm text-secondary-600">GPS Tracking</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsCollapsed(true)}
                        variant="ghost"
                        size="sm"
                      >
                        <ApperIcon name="X" className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <TrackingControls />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-secondary-900">Filter Trips</h3>
                      <DateRangePicker
                        startDate={dateRange.start}
                        endDate={dateRange.end}
                        onDateChange={handleDateChange}
                      />
                    </div>

                    <TripsList />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Sidebar;