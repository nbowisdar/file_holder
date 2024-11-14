export default function useRedirectToLogin() {
	const token = localStorage.getItem("token")
	if (!token) {
		window.location.href = "/sign-in"
	}
}
