import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";

const Loading = ({ className, ...props }) => {
  return (
    <div className={cn("w-full h-full flex items-center justify-center", className)} {...props}>
      <Card className="p-8 max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Loading spinner */}
          <div className="relative">
            <div className="w-16 h-16 mx-auto">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
            <motion.div
              className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-t-accent-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-secondary-900">Loading City Explorer</h3>
            <p className="text-sm text-secondary-600">
              Preparing your GPS tracking experience...
            </p>
          </div>

          {/* Skeleton content */}
          <div className="space-y-3">
            <div className="h-4 bg-secondary-200 rounded animate-pulse"></div>
            <div className="h-4 bg-secondary-200 rounded animate-pulse w-3/4 mx-auto"></div>
            <div className="h-4 bg-secondary-200 rounded animate-pulse w-1/2 mx-auto"></div>
          </div>
        </motion.div>
      </Card>
    </div>
  );
};

export default Loading;