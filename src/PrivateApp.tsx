import { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar";
import {
  BillingTemplate,
  SavedGraphTemplate,
  SavedGraphsTemplate,
  UnsavedGraphTemplate,
} from "./templates";
import RedirectSharedGraph from "./templates/RedirectShortUrl";

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
            <Route path="/graph" element={<Navigate to={`/${userID}/graph`} />} />
            <Route path={`/${userID}/graph/new`} element={<UnsavedGraphTemplate showLandingPage={false} />} />
            <Route path={`/${userID}/saved-graph/:uid`} element={<SavedGraphTemplate />} />
            <Route path={`/${userID}/billing`} element={<BillingTemplate />} />
            <Route path={`/${userID}/graphs`} element={<SavedGraphsTemplate />} />
            <Route path="/shared/graph/:uid" element={<RedirectSharedGraph />} />
            {/* Keep for legacy reasons */}
            <Route path="/graph/:uid" element={<RedirectSharedGraph />} />
            <Route path="*" element={<Navigate to={`/${userID}/graph`} />} />
          </Routes>
        </BrowserRouter >
      </div >
      : null
  );
};

export default PrivateApp;
