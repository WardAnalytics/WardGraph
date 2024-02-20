import { FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

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
  return (
    userID ?
      <div className="flex h-screen w-screen flex-row">
        < BrowserRouter >
          <Navbar userID={userID} />
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
            <Route path={`/${userID}/saved-graph/:uid`} element={<SavedGraphTemplate />} />
            <Route path={`/${userID}/billing`} element={<BillingTemplate />} />
            <Route path={`/${userID}/graphs`} element={<SavedGraphsTemplate />} />
            <Route path="*" element={<Navigate to={`/${userID}/graph`} />} />
          </Routes>
        </BrowserRouter >
      </div >
      : null
  );
};

export default PrivateApp;
