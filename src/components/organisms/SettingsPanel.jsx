import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import {
  updateSettings,
  updateMapProvider,
  updateUnits,
  updateNotificationSettings,
  updatePrivacySettings,
} from "@/store/slices/tripsSlice";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const SettingsPanel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { settings } = useSelector(state => state.trips);
  const [, setStoredSettings] = useLocalStorage('cityExplorerSettings', settings);
  const [activeTab, setActiveTab] = useState('general');

  // Persist settings to localStorage when they change
  useEffect(() => {
    setStoredSettings(settings);
  }, [settings, setStoredSettings]);

  // Listen for settings open event
  useEffect(() => {
    const handleOpenSettings = () => {
      // This will be handled by parent component
    };
    
    window.addEventListener('openSettings', handleOpenSettings);
    return () => window.removeEventListener('openSettings', handleOpenSettings);
  }, []);

  const handleMapProviderChange = (provider) => {
    dispatch(updateMapProvider(provider));
    toast.success(`Map provider changed to ${provider === 'osm' ? 'OpenStreetMap' : 'Google Maps'}`);
  };

  const handleUnitsChange = (units) => {
    dispatch(updateUnits(units));
    toast.success(`Units changed to ${units === 'metric' ? 'Metric (km/h)' : 'Imperial (mph)'}`);
  };

  const handleNotificationChange = (key, value) => {
    dispatch(updateNotificationSettings({ [key]: value }));
    toast.success('Notification preferences updated');
  };

  const handlePrivacyChange = (key, value) => {
    dispatch(updatePrivacySettings({ [key]: value }));
    toast.success('Privacy settings updated');
  };

  const handleSettingChange = (key, value) => {
    dispatch(updateSettings({ [key]: value }));
    toast.success('Settings updated successfully');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'map', label: 'Map & Units', icon: 'Map' },
    { id: 'tracking', label: 'Tracking', icon: 'Navigation' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'data', label: 'Data & Export', icon: 'Download' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-secondary-50 border-r border-secondary-200 p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Settings" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-secondary-900">Settings</h2>
                  <p className="text-sm text-secondary-600">Customize your experience</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                      activeTab === tab.id
                        ? "bg-primary-100 text-primary-700 border border-primary-200"
                        : "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                    )}
                  >
                    <ApperIcon name={tab.icon} className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                <div>
                  <h3 className="text-xl font-bold text-secondary-900">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h3>
                  <p className="text-sm text-secondary-600 mt-1">
                    Configure your preferences
                  </p>
                </div>
                <Button onClick={onClose} variant="ghost" size="sm">
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>

              {/* Settings Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Theme Preferences</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {['light', 'dark'].map((theme) => (
                          <Button
                            key={theme}
                            onClick={() => handleSettingChange('theme', theme)}
                            variant={settings.theme === theme ? 'primary' : 'secondary'}
                            className="justify-start"
                          >
                            <ApperIcon 
                              name={theme === 'light' ? 'Sun' : 'Moon'} 
                              className="w-4 h-4 mr-2" 
                            />
                            {theme === 'light' ? 'Light' : 'Dark'}
                          </Button>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Data Retention</h4>
                      <p className="text-sm text-secondary-600 mb-4">
                        Choose how long to keep your trip data
                      </p>
                      <select
                        value={settings.dataRetention}
                        onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                        className="w-full p-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value={7}>7 days</option>
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                        <option value={365}>1 year</option>
                        <option value={-1}>Forever</option>
                      </select>
                    </Card>
                  </div>
                )}

                {activeTab === 'map' && (
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Map Provider</h4>
                      <p className="text-sm text-secondary-600 mb-4">
                        Choose your preferred map service
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => handleMapProviderChange('osm')}
                          variant={settings.mapProvider === 'osm' ? 'primary' : 'secondary'}
                          className="justify-start"
                        >
                          <ApperIcon name="Map" className="w-4 h-4 mr-2" />
                          OpenStreetMap
                        </Button>
                        <Button
                          onClick={() => handleMapProviderChange('google')}
                          variant={settings.mapProvider === 'google' ? 'primary' : 'secondary'}
                          className="justify-start"
                        >
                          <ApperIcon name="Globe" className="w-4 h-4 mr-2" />
                          Google Maps
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Unit System</h4>
                      <p className="text-sm text-secondary-600 mb-4">
                        Choose between metric and imperial units
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => handleUnitsChange('metric')}
                          variant={settings.units === 'metric' ? 'primary' : 'secondary'}
                          className="justify-start"
                        >
                          <span className="mr-2">📏</span>
                          Metric (km/h)
                        </Button>
                        <Button
                          onClick={() => handleUnitsChange('imperial')}
                          variant={settings.units === 'imperial' ? 'primary' : 'secondary'}
                          className="justify-start"
                        >
                          <span className="mr-2">📐</span>
                          Imperial (mph)
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === 'tracking' && (
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">GPS Accuracy</h4>
                      <p className="text-sm text-secondary-600 mb-4">
                        Higher accuracy uses more battery
                      </p>
                      <select
                        value={settings.gpsAccuracy}
                        onChange={(e) => handleSettingChange('gpsAccuracy', e.target.value)}
                        className="w-full p-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="low">Low (Battery Saver)</option>
                        <option value="medium">Medium (Balanced)</option>
                        <option value="high">High (Best Accuracy)</option>
                      </select>
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Auto-Tracking</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Start tracking automatically</p>
                          <p className="text-sm text-secondary-600">Begin tracking when movement is detected</p>
                        </div>
                        <Button
                          onClick={() => handleSettingChange('autoTracking', !settings.autoTracking)}
                          variant={settings.autoTracking ? 'primary' : 'secondary'}
                          size="sm"
                        >
                          {settings.autoTracking ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Notification Preferences</h4>
                      <div className="space-y-4">
                        {Object.entries(settings.notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-sm text-secondary-600">
                                {key === 'trackingReminders' && 'Remind you to start tracking'}
                                {key === 'weeklyReports' && 'Weekly activity summaries'}
                                {key === 'achievements' && 'Milestone and achievement notifications'}
                              </p>
                            </div>
                            <Button
                              onClick={() => handleNotificationChange(key, !value)}
                              variant={value ? 'primary' : 'secondary'}
                              size="sm"
                            >
                              {value ? 'On' : 'Off'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Privacy Settings</h4>
                      <div className="space-y-4">
                        {Object.entries(settings.privacy).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-sm text-secondary-600">
                                {key === 'shareLocation' && 'Allow location sharing with others'}
                                {key === 'anonymizeData' && 'Remove personal identifiers from data'}
                              </p>
                            </div>
                            <Button
                              onClick={() => handlePrivacyChange(key, !value)}
                              variant={value ? 'primary' : 'secondary'}
                              size="sm"
                            >
                              {value ? 'Enabled' : 'Disabled'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Export Format</h4>
                      <p className="text-sm text-secondary-600 mb-4">
                        Choose default format for data exports
                      </p>
                      <select
                        value={settings.exportFormat}
                        onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                        className="w-full p-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="json">JSON (Developer friendly)</option>
                        <option value="csv">CSV (Spreadsheet compatible)</option>
                        <option value="gpx">GPX (GPS standard)</option>
                      </select>
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" className="justify-start">
                          <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                          Export All Data
                        </Button>
                        <Button variant="secondary" className="justify-start">
                          <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                          Import Data
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsPanel;