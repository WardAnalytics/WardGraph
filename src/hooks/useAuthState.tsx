import authService from '../services/auth/auth.services';

const useAuthState = () => {

    // You can return additional user-related information or logic here if needed
    return authService.getCurrentUser();
};

export default useAuthState;