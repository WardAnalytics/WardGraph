import { RocketLaunchIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { FC, useMemo } from "react";
import { PlansList } from ".";
import useAuthState from "../../hooks/useAuthState";
import BigButton from "../common/BigButton";
import Modal from "../common/Modal";

interface TurnPremiumDialogProps {
    isOpen: boolean;
    onClose: () => void;
    sucessRedirectPath?: string;
    cancelRedirectPath?: string;
}

/** Dialog to show when the user tries to perform an action that requires a Pro plan. This dialog will show the user the Pro plans and allow them to upgrade to a Pro plan.
 * 
 * @param isOpen - Whether the dialog is open
 * @param onClose - Function to call when the dialog is closed
 * @returns - A dialog to show the user the Pro plans and allow them to upgrade to a Pro plan
 */
const TurnPremiumDialog: FC<TurnPremiumDialogProps> = ({
    isOpen,
    onClose,
    sucessRedirectPath = "",
    cancelRedirectPath = "",
}) => {
    const { user } = useAuthState();

    const userID = useMemo(() => {
        return user?.uid || "";
    }, [user]);

    return (
        <Modal isOpen={isOpen} closeModal={onClose}>
            <div className="flex items-center justify-between pb-3">
                <h3 className="flex flex-row items-center gap-x-1.5 text-base font-semibold leading-6 text-gray-900">
                    <RocketLaunchIcon className="h-7 w-7 text-gray-400" />
                    Upgrade to a Pro plan
                </h3>

                <BigButton
                    onClick={onClose}
                    text="Close"
                    Icon={XMarkIcon}
                />
            </div>
            <div className="flex flex-col justify-center pt-3 gap-y-5">
                <p className="text-gray-500">
                    You reached the limit of the free usage of this feature. To continue using it, you need to upgrade to a Pro plan.
                </p>
                <PlansList isPro={false} userID={userID} sucessRedirectPath={sucessRedirectPath} cancelRedirectPath={cancelRedirectPath} />
            </div>
        </Modal >
    )
}

export default TurnPremiumDialog;