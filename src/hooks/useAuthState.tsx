import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import authService from '../services/auth/auth.services';

const useAuthState = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = authService.getCurrentUser((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return user;
};

export default useAuthState;