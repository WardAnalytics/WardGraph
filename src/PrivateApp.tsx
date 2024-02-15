import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar";
import {
  BillingTemplate,
  SavedGraphTemplate,
  SavedGraphsTemplate,
  UnsavedGraphTemplate,
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
          <Route path="/graph/new" element={<UnsavedGraphTemplate showLandingPage={false} />} />
          <Route path="/saved-graph/:uid" element={<SavedGraphTemplate />} />
          <Route path="/billing" element={<BillingTemplate />} />
          <Route path="/graphs" element={<SavedGraphsTemplate />} />
          <Route path="*" element={<UnsavedGraphTemplate showLandingPage={false} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default PrivateApp;
