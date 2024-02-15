import React from 'react';
import AuthDialog from './components/auth';
import useAuthState from './hooks/useAuthState';
import { UserNotLoggedInError } from './services/auth/errors';

/**
 * pathname: The path to redirect to
 * 
 * search: The query string to append to the URL
 * 
 * @example
 * const redirectUrl: RedirectUrl = {
 * pathname: 'graph',
 * search: createSearchParams({
        foo: "bar"
    }).toString()
 */
export interface RedirectUrl {
  pathname: string;
  search?: string;
}

export interface WithAuthProps {
  handleActionRequiringAuth: (redirectUrl: RedirectUrl) => void;
}

/** Wrapper component that shows an auth dialog if the user is not authenticated
 * The wrapped component should accept a `handleActionRequiringAuth` prop that is a function
 * that should be called when the user tries to perform an action that requires authentication
 * 
 * @param WrappedComponent - The component to wrap with authentication
 * @returns A new component that wraps the provided component with authentication
 * 
 * @throws {UserNotLoggedInError} - If the user is not authenticated and tries to perform an action that requires authentication.
 * 
 * @example
 * interface MyComponentProps extends WithAuthProps {
 *  someProp: string;
 * }
 * 
 * const MyComponent: FC<MyComponentProps> = ({ 
 *  handleActionRequiringAuth,
 *  someProp
 * }) => {
 *    return (
 *      <button onClick={handleActionRequiringAuth}>Click me</button>
 *    );
 * };
 * 
 * export default WithAuth(MyComponent);
 */
const WithAuth = <P extends WithAuthProps>(WrappedComponent: React.ComponentType<P>) => {
  return (props: Omit<P, keyof WithAuthProps>) => {
    const { isAuthenticated } = useAuthState();
    const [showAuthModal, setShowAuthModal] = React.useState(false);
    const [redirectUrl, setRedirectUrl] = React.useState<RedirectUrl>({
      pathname: '/',
    }); // The URL to redirect to after the user logs in

    /** Function to call when the user tries to perform an action that requires authentication
     * This function should be called before the action that requires authentication is performed and will throw an error if the user is not authenticated
     * 
     * @param redirectUrl - The URL to redirect to after the user logs in
     * 
     * @throws {UserNotLoggedInError} - If the user is not authenticated
     * 
     * @example
     * const handleSaveGraph = () => {
     *    handleActionRequiringAuth({
     *      pathname: 'graph',
     *      search: createSearchParams({
     *        save_graph: "true"
     *      }).toString()
     *    });
     * 
     *    // Save the graph
     *    // This code will only be executed if the user is authenticated
     *    saveGraph();
     * };
     */
    const handleActionRequiringAuth = (redirectUrl: RedirectUrl) => {
      if (!isAuthenticated) {
        setShowAuthModal(true);
        setRedirectUrl(redirectUrl);
        throw new UserNotLoggedInError("User is not logged in");
      }
    };

    return (
      <>
        <WrappedComponent {...(props as P)} handleActionRequiringAuth={handleActionRequiringAuth} />
        <AuthDialog isOpen={showAuthModal} setIsOpen={setShowAuthModal} redirectUrl={redirectUrl} />
      </>
    );
  };
};

export default WithAuth;