import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className, 
  gradient = false,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("", className)}
    >
      <Card 
        variant={gradient ? "gradient" : "elevated"}
        className="p-6 group hover:scale-[1.02] transition-all duration-300"
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-secondary-900 mb-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  className={cn(
                    "w-4 h-4",
                    trend === "up" ? "text-success" : "text-error"
                  )}
                />
                <span className={cn(
                  "text-sm font-medium",
                  trend === "up" ? "text-success" : "text-error"
                )}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ApperIcon name={icon} className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;