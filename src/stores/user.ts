import {ref} from 'vue';
import {defineStore} from 'pinia';
import type {OTPVerificationRequest, UserCreate, UserRead} from '@/api/user-api';
import {UserAPI} from '@/api/user-api';

export const useUserStore = defineStore('user', () => {
    const currentUser = ref<UserRead | null>(null);
    const isUserLoading = ref(false);
    const isSessionChecked = ref(false);

    const checkSession = async (): Promise<void> => {
        isUserLoading.value = true;
        try {
            await UserAPI.checkSessionValidity();
            if (!sessionStorage.getItem('currentUser')) {
                await getCurrentUser();
            } else {
                const storedUser = sessionStorage.getItem('currentUser');
                currentUser.value = storedUser ? JSON.parse(storedUser) : null;
            }
        } catch (error) {
            console.error('Session check failed:', error);
            currentUser.value = null;
            sessionStorage.removeItem('currentUser');
        } finally {
            isUserLoading.value = false;
            isSessionChecked.value = true;
        }
    };

    const registerUser = async (userData: UserCreate): Promise<void> => {
        isUserLoading.value = true;
        try {
            await UserAPI.registerUser(userData);
        } catch (error) {
            throw new Error("Register failed");
        } finally {
            isUserLoading.value = false;
        }
    };

    const login = async (credentials: {
        username: string;
        password: string
    }): Promise<void> => {
        isUserLoading.value = true;
        try {
            await UserAPI.login(credentials);
        } catch (error) {
            throw new Error("Login failed");
        } finally {
            isUserLoading.value = false;
        }
    };

    const verifyOTP = async (otpVerificationData: OTPVerificationRequest): Promise<void> => {
        isUserLoading.value = true;
        try {
            await UserAPI.verifyOTP(otpVerificationData);
            await getCurrentUser();
        } catch (error) {
            console.error('OTP Verification failed:', error);
            throw new Error('OTP Verification failed');
        } finally {
            isUserLoading.value = false;
        }
    };

    const logout = async (): Promise<void> => {
        isUserLoading.value = true;
        try {
            await UserAPI.logout();
            currentUser.value = null;
            sessionStorage.removeItem('currentUser');
        } catch (error) {
            console.error('Logout failed:', error);
            throw new Error('Logout failed');
        } finally {
            isUserLoading.value = false;
        }
    };

    const getCurrentUser = async (): Promise<void> => {
        isUserLoading.value = true;
        try {
            currentUser.value = await UserAPI.getCurrentUser();
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser.value));
        } catch (error) {
            console.error('Fetching current user failed:', error);
            throw new Error('Fetching current user failed');
        } finally {
            isUserLoading.value = false;
        }
    };

    const fetchOAuthUrl = async (): Promise<string> => {
        try {
            return await UserAPI.getOAuthAuthorizationUrl();
        } catch (error) {
            console.error('Fetch OAuth URL failed:', error);
            throw new Error('Fetch OAuth URL failed');
        }
    };

    const handleOAuthCallback = async (code: string, state: string): Promise<void> => {
        try {
            await UserAPI.handleOAuthCallback(code, state);
            await getCurrentUser();
        } catch (error) {
            console.error('OAuth Callback failed:', error);
            throw new Error('OAuth Callback failed');
        }
    };

    const forgotPassword = async (email: string): Promise<void> => {
        isUserLoading.value = true;
        try {
            await UserAPI.forgotPassword(email);
        } catch (error) {
            console.error('Forgot password request failed:', error);
            throw new Error('Forgot password request failed');
        } finally {
            isUserLoading.value = false;
        }
    };

    const resetPassword = async (token: string, password: string): Promise<void> => {
        isUserLoading.value = true;
        try {
            await UserAPI.resetPassword(token, password);
        } catch (error) {
            console.error('Password reset failed:', error);
            throw new Error('Password reset failed');
        } finally {
            isUserLoading.value = false;
        }
    };

    return {
        currentUser,
        isUserLoading,
        registerUser,
        login,
        verifyOTP,
        logout,
        getCurrentUser,
        fetchOAuthUrl,
        handleOAuthCallback,
        forgotPassword,
        resetPassword,
        checkSession,
        isSessionChecked
    };
});
