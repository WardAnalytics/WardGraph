"use client";

import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignInBanner from "./components/banner/LoginBanner";
import { UnsavedGraphTemplate } from "./templates";

const PublicApp: FC = () => {
  return (
    <BrowserRouter>
      <SignInBanner />
      <div className="flex h-screen w-screen flex-row">
        <Routes>
          <Route path="/graph/:uid" element={<UnsavedGraphTemplate />} />
          <Route path="/graph" element={<UnsavedGraphTemplate />} />
          <Route path="*" element={<UnsavedGraphTemplate />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default PublicApp;
