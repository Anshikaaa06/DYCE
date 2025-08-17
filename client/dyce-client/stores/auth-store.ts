import { create } from "zustand";
import axios from "axios";
import { axiosClient } from "@/lib/axios-client";

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  message: string | null;
  expired: boolean;
  signup: (dto: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<any>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	expired:false,

	signup: async (dto) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosClient.post(`/auth/signup`, { ...dto });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error: any) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosClient.post(`/auth/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axiosClient.post(`/auth/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error:any) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosClient.post(`/auth/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error:any) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axiosClient.get(`/auth/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosClient.post(`/auth/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error:any) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosClient.post(`/auth/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false, expired: response.data.expired });
		} catch (error:any) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));