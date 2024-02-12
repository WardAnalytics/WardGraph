import { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar";
import {
  BillingTemplate,
  SavedGraphTemplate,
  UnsavedGraphTemplate,
  SavedGraphsTemplate,
} from "./templates";

const PrivateApp: FC = () => {
  return (
    <div className="flex h-screen w-screen flex-row">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/graph/:uid"
            element={<UnsavedGraphTemplate showLandingPage={false} />}
          />
          <Route
            path="/graph"
            element={<UnsavedGraphTemplate showLandingPage={false} />}
          />
          <Route path="/saved-graph/:uid" element={<SavedGraphTemplate />} />
          <Route path="/billing" element={<BillingTemplate />} />
          <Route path="/graphs" element={<SavedGraphsTemplate />} />
          <Route path="*" element={<Navigate to="/graph" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default PrivateApp;
