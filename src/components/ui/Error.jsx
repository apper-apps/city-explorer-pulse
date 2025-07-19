import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";


function Error({ message, onRetry, className, ...props }) {
  return (
    <div className={cn("w-full h-full flex items-center justify-center", className)} {...props}>
      <Card className="p-8 max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Error icon */}
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-white" />
          </div>

          {/* Error message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-secondary-900">
              Oops! Something went wrong
            </h3>
            <p className="text-sm text-secondary-600">
              {message}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button onClick={onRetry} variant="primary">
                <ApperIcon name="RotateCcw" className="w-4 h-4" />
                Try Again
              </Button>
            )}
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4" />
              Refresh Page
            </Button>
          </div>

          {/* Help text */}
          <p className="text-xs text-secondary-500">
            If the problem persists, please check your internet connection and GPS permissions.
          </p>
        </motion.div>
      </Card>
    </div>
  );
}

export default Error;