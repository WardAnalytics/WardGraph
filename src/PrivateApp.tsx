import { FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { PrivateGraphTemplate, BillingTemplate } from "./templates";
import Navbar from "./components/navbar";

const PrivateApp: FC = () => {
  return (
    <div className="flex h-screen w-screen flex-row">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/graph" element={<PrivateGraphTemplate />} />
          <Route path="/billing" element={<BillingTemplate />} />
          {/* <Route path="/risk-feed" element={<RiskFeedTemplate />} /> */}
          <Route path="*" element={<Navigate to="/graph" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default PrivateApp;
