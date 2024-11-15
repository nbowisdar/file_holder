import axios, { InternalAxiosRequestConfig } from "axios"

const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Set your base URL here
})

// Request Interceptor
const onRequest = (
	config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
	// Check if we're in the browser, as localStorage is only available there
	const token =
		typeof window !== "undefined" ? localStorage.getItem("token") : null
	if (token && config.headers) {
		config.headers.set("Authorization", `Bearer ${token}`)
	}
	return config
}

// Add a request interceptor
axiosClient.interceptors.request.use(onRequest)

export default axiosClient
