import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onDateChange, 
  className,
  ...props 
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const presetRanges = [
    {
      label: "Today",
      getValue: () => {
        const today = new Date();
        return {
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
        };
      }
    },
    {
      label: "This Week",
      getValue: () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek);
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - dayOfWeek), 23, 59, 59);
        return { start, end };
      }
    },
    {
      label: "This Month",
      getValue: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        return { start, end };
      }
    },
    {
      label: "Last 30 Days",
      getValue: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        return { start, end };
      }
    }
  ];

  const handlePresetSelect = (preset) => {
    const { start, end } = preset.getValue();
    onDateChange(start, end);
    setShowPicker(false);
  };

  const handleDateSelect = (dates) => {
    const [start, end] = dates;
    onDateChange(start, end);
    if (start && end) {
      setShowPicker(false);
    }
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return "Select date range";
    
    const options = { month: "short", day: "numeric" };
    const startFormatted = startDate.toLocaleDateString("en-US", options);
    const endFormatted = endDate.toLocaleDateString("en-US", options);
    
    if (startDate.getFullYear() !== endDate.getFullYear()) {
      return `${startFormatted}, ${startDate.getFullYear()} - ${endFormatted}, ${endDate.getFullYear()}`;
    } else if (startDate.getMonth() !== endDate.getMonth()) {
      return `${startFormatted} - ${endFormatted}, ${endDate.getFullYear()}`;
    } else if (startDate.getDate() === endDate.getDate()) {
      return `${startFormatted}, ${endDate.getFullYear()}`;
    } else {
      return `${startFormatted} - ${endFormatted}, ${endDate.getFullYear()}`;
    }
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <Button
        variant="secondary"
        onClick={() => setShowPicker(!showPicker)}
        className="justify-between min-w-[200px]"
      >
        <span className="flex items-center gap-2">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          {formatDateRange()}
        </span>
        <ApperIcon 
          name={showPicker ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4" 
        />
      </Button>

      {showPicker && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full mt-2 left-0 z-50"
        >
          <Card className="p-4 shadow-xl border-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {presetRanges.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePresetSelect(preset)}
                    className="justify-start text-left"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              
              <div className="border-t border-secondary-200 pt-4">
                <DatePicker
                  selected={startDate}
                  onChange={handleDateSelect}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  showDisabledMonthNavigation
                  maxDate={new Date()}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DateRangePicker;