import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PublicGraphTemplate } from "./templates";

const PublicApp: FC = () => {
  return (
    <div className="flex h-screen w-screen flex-row">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<PublicGraphTemplate />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default PublicApp;
