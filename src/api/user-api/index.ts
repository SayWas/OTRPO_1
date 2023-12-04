import {LoginAPIInstance, DefaultAPIInstance} from '@/api';


export const UserAPI = {
    /**
     * @description Check if the current user session is valid
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating session validity
     * @throws {Error} If there is an error during the request
     */
    async checkSessionValidity(): Promise<boolean> {
        const url: string = 'users/me';
        let isValid: boolean = false;
        let errorMessage: string = '';

        await DefaultAPIInstance.get(url, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    console.log('Session is valid');
                    isValid = true;
                }
            })
            .catch((error) => {
                errorMessage = error.message;
                console.error('Session check failed:', error);
            });

        if (errorMessage) {
            throw new Error(errorMessage);
        }

        return isValid;
    },

    /**
     * @description Register a new user
     * @param userData - The data needed to create a new user
     * @returns UserRead object
     * @throws {Error} Request error message
     */
    async registerUser(userData: UserCreate): Promise<UserRead> {
        const url: string = '/auth/register';
        let user: UserRead | undefined;
        let errorMessage: string = '';

        const completeUserData = {
            'email': userData.email,
            'password': userData.password,
            'is_active': userData.is_active ?? true,
            'is_superuser': userData.is_superuser ?? false,
            'is_verified': userData.is_verified ?? false
        };

        console.log(completeUserData);

        await DefaultAPIInstance.post(url, completeUserData)
            .then((response) => {
                if (response.status === 201) {
                    console.log(response);
                    user = response.data;
                }
            })
            .catch((error) => (errorMessage = error.message));

        if (user) return user;
        throw new Error(errorMessage);
    },

    /**
     * @description Login user and initiate 2FA process
     * @param credentials - The login credentials
     * @returns A message indicating 2FA is required and the user_id
     * @throws {Error} Request error message
     */
    async login(credentials: { username: string; password: string }): Promise<{ message: string; user_id: string }> {
        const url: string = '/auth/login';
        let responseContent: { message: string; user_id: string } | undefined;
        let errorMessage: string = '';

        await LoginAPIInstance.post(url, credentials)
            .then((response) => {
                if (response.status === 202) {
                    console.log(response);
                    responseContent = response.data;
                }
            })
            .catch((error) => (errorMessage = error.message));

        if (responseContent) return responseContent;
        throw new Error(errorMessage);
    },

    /**
     * @description Verify OTP for 2FA
     * @param data - The OTP verification request data
     * @returns Nothing on success
     * @throws {Error} Request error message
     */
    async verifyOTP(data: OTPVerificationRequest): Promise<void> {
        const url = '/auth/verify-otp';
        let errorMessage = '';

        const payload = new URLSearchParams();
        payload.append('username', data.username);
        payload.append('password', data.password);
        payload.append('otp', data.otp);

        await LoginAPIInstance.post(url, payload.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => {
                if (response.status === 204) {
                    console.log('OTP verified successfully');
                }
            })
            .catch((error) => (errorMessage = error.message));

        if (errorMessage) {
            throw new Error(errorMessage);
        }
    },


    /**
     * @description Get OAuth authorization URL from backend
     * @returns Authorization URL as a string
     * @throws {Error} Request error message
     */
    async getOAuthAuthorizationUrl(): Promise<string> {
        const url: string = '/auth/google/authorize';
        let authorizationUrl: string | undefined;
        let errorMessage: string = '';

        await LoginAPIInstance.get<{ authorization_url: string }>(url)
            .then((response) => {
                if (response.status === 200) {
                    authorizationUrl = response.data.authorization_url;
                }
            })
            .catch((error) => (errorMessage = error.message));

        if (authorizationUrl) return authorizationUrl;
        throw new Error(errorMessage);
    },

    /**
     * @description Handle OAuth callback from the provider
     * @param code - The code received from the OAuth provider
     * @param state - The state received from the OAuth provider
     * @returns The user information or token as a string
     * @throws {Error} Request error message
     */
    async handleOAuthCallback(code: string, state: string): Promise<void> {
        const url: string = `/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
        let errorMessage: string = '';

        await LoginAPIInstance.get(url)
            .then((response) => {
                if (response.status === 200) {
                    console.log('OAuth callback handled successfully.');
                }
            })
            .catch((error) => (errorMessage = error.message));

        if (errorMessage) throw new Error(errorMessage);
    },

    /**
     * @description Logout the user
     * @returns Nothing on success
     * @throws {Error} Request error message
     */
    async logout(): Promise<void> {
        const url: string = '/auth/logout';
        let errorMessage: string = '';

        await LoginAPIInstance.post(url)
            .then((response) => {
                if (response.status === 200) {
                    console.log('Logged out successfully');
                }
            })
            .catch((error) => (errorMessage = error.message));

        if (errorMessage) throw new Error(errorMessage);
    },

    /**
     * @description Retrieve the current user's information
     * @returns User object with details of the current user
     * @throws {Error} Request error message
     */
    async getCurrentUser(): Promise<UserRead> {
        const url: string = '/users/me';
        let user: UserRead | undefined;
        let errorMessage: string = '';

        await DefaultAPIInstance.get<UserRead>(url)
            .then((response) => {
                if (response.status === 200) {
                    user = response.data;
                }
            })
            .catch((error) => (errorMessage = error.message));

        if (user) return user;
        throw new Error(errorMessage);
    },

    /**
     * Send a password reset link to the given email.
     * @param {string} email - The email address to send the password reset link to.
     * @returns {Promise<void>} A promise that resolves if the email was sent successfully.
     * @throws {Error} Throws an error if the request fails.
     */
    async forgotPassword(email: string): Promise<void> {
        const url = '/auth/forgot-password';
        let errorMessage = '';

        const data = {
            'email': email
        };

        await DefaultAPIInstance.post(url, data)
            .then((response) => {
                if (response.status === 202) {
                    console.log('Forgot password email sent successfully.');
                }
            })
            .catch((error) => (errorMessage = error.message));

        if (errorMessage) throw new Error(errorMessage);
    },

    /**
     * Reset the password using the token received via email.
     * @param {string} token - The token received from the password reset email.
     * @param {string} password - The new password to set.
     * @returns {Promise<void>} A promise that resolves if the password was reset successfully.
     * @throws {Error} Throws an error if the request fails.
     */
    async resetPassword(token: string, password: string): Promise<void> {
        const url = '/auth/reset-password';
        let errorMessage = '';

        const data = {
            'token': token,
            'password': password
        }

        await DefaultAPIInstance.post(url, data)
            .then((response) => {
                if (response.status === 200) {
                    console.log('Password reset successfully.');
                }
            })
            .catch((error) => (errorMessage = error.message));

        if (errorMessage) throw new Error(errorMessage);
    },
};


interface UserRead {
    id: string;
    email: string;
    is_active: boolean;
    is_verified: boolean;
    role: RoleRead;
}

interface UserCreate {
    email: string;
    password: string;
    is_active?: boolean;
    is_superuser?: boolean;
    is_verified?: boolean;
}

interface PermissionSet {
    [permission: string]: boolean;
}

interface RoleRead {
    id: number;
    name: string;
    permissions: PermissionSet | null;
}

interface OTPVerificationRequest {
    username: string;
    password: string;
    otp: string;
}

export type {UserRead, RoleRead, OTPVerificationRequest, UserCreate, PermissionSet};
