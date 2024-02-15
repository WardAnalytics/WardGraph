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
 * @returns 
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

    const handleActionRequiringAuth = (redirectUrl: RedirectUrl) => {
      if (!isAuthenticated) {
        setShowAuthModal(true);
        setRedirectUrl(redirectUrl);
        throw new UserNotLoggedInError("User is not logged in");
      }
    };

    return (
      <div>
        <WrappedComponent {...(props as P)} handleActionRequiringAuth={handleActionRequiringAuth} />
        <AuthDialog isOpen={showAuthModal} setIsOpen={setShowAuthModal} redirectUrl={redirectUrl} />
      </div>
    );
  };
};

export default WithAuth;