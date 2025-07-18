import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available", 
  description = "There's nothing to show here yet.", 
  icon = "Inbox", 
  action, 
  actionText = "Get Started",
  className, 
  ...props 
}) => {
  return (
    <div className={cn("w-full h-full flex items-center justify-center", className)} {...props}>
      <Card className="p-8 max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Empty state icon */}
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="w-8 h-8 text-secondary-500" />
          </div>

          {/* Empty state content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-secondary-900">
              {title}
            </h3>
            <p className="text-sm text-secondary-600">
              {description}
            </p>
          </div>

          {/* Action button */}
          {action && (
            <Button onClick={action} variant="primary">
              <ApperIcon name="Plus" className="w-4 h-4" />
              {actionText}
            </Button>
          )}

          {/* Decorative elements */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
            <div className="w-2 h-2 bg-accent-300 rounded-full"></div>
            <div className="w-2 h-2 bg-secondary-300 rounded-full"></div>
          </div>
        </motion.div>
      </Card>
    </div>
  );
};

export default Empty;