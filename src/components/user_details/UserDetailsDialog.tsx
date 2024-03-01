import {
  XMarkIcon
} from "@heroicons/react/24/outline";
import { FC, createContext, useEffect, useState } from "react";


import { User } from "../../services/auth/auth.services";
import { logAnalyticsEvent } from "../../services/firestore/analytics/analytics";
import Modal from "../common/Modal";
import UserDetailsForm from "./UserDetailsForm";
import useAuthState from "../../hooks/useAuthState";

interface UserDetailsContextProps {
  onSubmitUserDetailsSuccess: (updatedUser: User) => void;
  onSubmitUserDetailsError: (error: any) => void;
}

export const UserDetailsContext = createContext<UserDetailsContextProps>({
  onSubmitUserDetailsSuccess: () => { },
  onSubmitUserDetailsError: () => { },
});

interface UserDetailsDialogProps { }

const UserDetailsDialog: FC<UserDetailsDialogProps> = ({ }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthState();

  /**
   * Closes the dialog
   *
   * @returns void
   */
  const closeDialog = () => {
    setIsOpen(false);
  };

  /**
   * Callback function for when the user successfully submits the user details form
   *
   * @returns void
   */
  const onSubmitUserDetailsSuccess = (updatedUser: User) => {
    logAnalyticsEvent("user_details_updated");
    localStorage.setItem("user", JSON.stringify(updatedUser));
    closeDialog();
  };

  /**
   * Callback function for when the user fails to submit the user details form
   *
   * @param error
   * @returns void
   */
  const onSubmitUserDetailsError = (error: any) => {
    logAnalyticsEvent("user_details_update_error", { error });

  };

  const userDetailsContext: UserDetailsContextProps = {
    onSubmitUserDetailsSuccess,
    onSubmitUserDetailsError
  };

  useEffect(() => {
    // Open the dialog if the user has not filled in all the required details
    if (
      user &&
      !user?.userData?.username ||
      !user?.userData?.company ||
      !user?.userData?.position
    ) {
      setIsOpen(true);
    }
  }, [user]);

  return (
    <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} size="md">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="flex flex-row items-center gap-x-1.5 text-lg font-semibold leading-6 text-gray-900">
          <>Add remaining account information</>
        </h3>

        <XMarkIcon
          className="h-11 w-11 cursor-pointer rounded-full p-1.5 text-gray-400 transition-all duration-300 hover:bg-gray-100"
          aria-hidden="true"
          onClick={closeDialog}
        />
      </div>
      <div className="mt-3">
        <UserDetailsContext.Provider value={userDetailsContext}>
          <UserDetailsForm />
        </UserDetailsContext.Provider>
      </div>
    </Modal >
  );
};

export default UserDetailsDialog;
