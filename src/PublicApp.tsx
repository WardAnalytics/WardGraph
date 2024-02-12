import { FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Banner from "./components/banner";

import { UnsavedGraphTemplate } from "./templates";

const PublicApp: FC = () => {
  return (
    <div className="flex h-screen w-screen flex-row">
      <Banner />
      <BrowserRouter>
        <Routes>
          <Route path="/graph/:uid" element={<UnsavedGraphTemplate />} />
          <Route path="/graph" element={<UnsavedGraphTemplate />} />
          <Route path="*" element={<Navigate to="/graph" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default PublicApp;
