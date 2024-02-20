import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar";
import {
  BillingTemplate,
  SavedGraphTemplate,
  SavedGraphsTemplate,
  UnsavedGraphTemplate,
} from "./templates";

interface PrivateAppProps {
  userID: string;
}

const PrivateApp: FC<PrivateAppProps> = ({
  userID
}) => {
  console.log(userID);

  return (
    <div className="flex h-screen w-screen flex-row">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path={`/${userID}/graph/:uid`}
            element={<UnsavedGraphTemplate showLandingPage={false} />}
          />
          <Route
            path={`/${userID}/graph`}
            element={<UnsavedGraphTemplate showLandingPage={false} />}
          />
          <Route path={`/${userID}/graph/new`} element={<UnsavedGraphTemplate showLandingPage={false} />} />
          <Route path="/saved-graph/:uid" element={<SavedGraphTemplate />} />
          <Route path={`${userID}/billing`} element={<BillingTemplate />} />
          <Route path={`${userID}/graphs`} element={<SavedGraphsTemplate />} />
          <Route path="*" element={<UnsavedGraphTemplate showLandingPage={false} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default PrivateApp;
