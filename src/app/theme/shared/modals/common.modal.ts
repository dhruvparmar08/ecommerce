export interface Authuser {
    email: string;
    password: string;
    isremember?: boolean;
    user_device?: string;
    user_device_type?: string;
}

export interface RegisterUser {
    name: string;
    mobile: string;
    email: string;
    password: string;
}

export interface ResetPWDToken {
    _id: string;
    token: string;
    generateTime: Date;
}

export interface User {
    name: string;
    email: string;
    mobile: string;
    profile_id?: string | null;
    profileUrl?: string | null;
}

export interface Response {
    message: string;
    success: boolean;
    success_code: number;
    data?: any | null;
}