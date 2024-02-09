import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PrivateGraphTemplate, RiskFeedTemplate } from "./templates";
import Navbar from "./components/navbar";
import SubscriptionManagerPage from "./components/payments/SubscriptionManagerPage";

const PrivateApp: FC = () => {
  return (
    <div className="flex h-screen w-screen flex-row">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/graph" element={<PrivateGraphTemplate />} />
          <Route path="/risk-feed" element={<RiskFeedTemplate />} />
          <Route path="/subscription-manager" element={<SubscriptionManagerPage />} />
          <Route path="/*" element={<PrivateGraphTemplate />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default PrivateApp;
