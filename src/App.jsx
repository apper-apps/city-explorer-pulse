import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import MapPage from "@/components/pages/MapPage";
import Layout from "@/components/organisms/Layout";
import SettingsPanel from "@/components/organisms/SettingsPanel";
import { updateSettings } from "@/store/slices/tripsSlice";
import { useLocalStorage } from "@/hooks/useLocalStorage";
function App() {
  const dispatch = useDispatch();
  const { settings } = useSelector(state => state.trips);
  const [storedSettings] = useLocalStorage('cityExplorerSettings', settings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load settings from localStorage on app start
  useEffect(() => {
    if (storedSettings && Object.keys(storedSettings).length > 0) {
      dispatch(updateSettings(storedSettings));
    }
  }, [dispatch, storedSettings]);

  // Listen for settings open event
  useEffect(() => {
    const handleOpenSettings = () => {
      setIsSettingsOpen(true);
    };
    
    window.addEventListener('openSettings', handleOpenSettings);
    return () => window.removeEventListener('openSettings', handleOpenSettings);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <Routes>
          <Route path="/" element={<MapPage />} />
        </Routes>
</Layout>

      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={settings.theme || "light"}
        className="z-[9999]"
      />
    </div>
  );
}

export default App;