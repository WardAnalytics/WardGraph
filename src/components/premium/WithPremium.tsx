import React, { useMemo } from 'react';
import WithAuth, { WithAuthProps } from '../auth/WithAuth';
import useAuthState from '../../hooks/useAuthState';
import { UserNotPremiumError } from '../../services/auth/errors';
import { usePremiumStatus } from '../../services/firestore/user/premium';
import TurnPremiumDialog from './TurnPremiumDialog';

/**
 * sucessPath: The path to redirect to after the user turns premium
 * 
 * cancelPath: The path to redirect to if the user cancels turning premium
 * 
 * @example
 * const redirectUrl: PremiumRedirectUrl = {
 *  sucessPath: 'graph',
 *  cancelPath: 'home'
 * }
 * 
 */
export interface PremiumRedirectUrl {
    successPath: string;
    cancelPath: string;
}

/** Props that are added to the wrapped component. Extends the `WithAuthProps` interface, since the user needs to be authenticated to be a premium user
 *  @property handleActionRequiringPremium - A function that should be called when the user tries to perform an action that requires being a premium user
 */
export interface WithPremiumProps extends WithAuthProps {
    handleActionRequiringPremium: (redirectUrl: PremiumRedirectUrl) => void;
}

/** Wrapper component that shows a premium dialog if the user is not a premium user. 
 * The wrapped component should accept a `handleActionRequiringPremium` prop that is a function
 * that should be called when the user tries to perform an action that requires being a premium user
 * 
 * @param WrappedComponent - The component to wrap with premium status
 * @returns A new component that wraps the provided component with premium status
 * 
 * @throws {UserNotPremiumError} - If the user is not a premium user and tries to perform an action that requires being a premium user.
 * @throws {UserNotLoggedInError} - If the user is not authenticated.
 * 
 * @example
 * interface MyComponentProps extends WithPremiumProps {
 *  someProp: string;
 * }
 * 
 * const MyComponent: FC<MyComponentProps> = ({ 
 *  handleActionRequiringPremium,
 *  someProp
 * }) => {
 *    return (
 *      <button onClick={handleActionRequiringPremium}>Click me</button>
 *    );
 * };
 * 
 * export default WithPremium(MyComponent);
 */
const WithPremium = <P extends WithPremiumProps>(WrappedComponent: React.ComponentType<P>) => {
    return (props: Omit<P, keyof WithPremiumProps>) => {
        const { user } = useAuthState();

        const userID = useMemo(() => {
            return user?.uid || "";
        }, [user]);

        const { isPremium } =
            usePremiumStatus(userID);

        const [showPremiumModal, setShowPremiumModal] = React.useState(false);
        const [successPath, setSuccessPath] = React.useState("");
        const [cancelPath, setCancelPath] = React.useState("");

        // For the user to turn premium, they need to be authenticated
        const WrappedComponentWithAuth = WithAuth(WrappedComponent);

        /** Function to call when the user tries to perform an action that requires being a premium user
         * This function should be called before the action that requires being a premium user is performed and will throw an error if the user is not a premium user
         * 
         * @param successPath - The path to redirect to after the user turns premium
         * @param cancelPath - The path to redirect to if the user cancels turning premium
         * 
         * @throws {UserNotPremiumError} - If the user is not a premium user
         * 
         * @example
         * const handleSaveGraph = () => {
         *    handleActionRequiringPremium({
         *      successPath: "graph",
         *      cancelPath: "home"
         *    });
         * saveGraph();
         * }
         */
        const handleActionRequiringPremium = ({
            successPath = "",
            cancelPath = "",
        }: PremiumRedirectUrl) => {
            if (!isPremium) {
                setShowPremiumModal(true);
                setSuccessPath(successPath);
                setCancelPath(cancelPath);
                throw new UserNotPremiumError("User is not premium");
            }
        };

        return (
            <>
                <>
                    <WrappedComponentWithAuth {...(props as P)} handleActionRequiringPremium={handleActionRequiringPremium} />
                </>
                <TurnPremiumDialog isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} sucessRedirectPath={successPath} cancelRedirectPath={cancelPath} />
            </>
        );
    };
};

export default WithPremium;