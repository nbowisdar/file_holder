"use client"

import { useEffect } from "react"

export default function useRedirectToLogin() {
	useEffect(() => {
		const token = localStorage.getItem("token")
		if (!token) {
			window.location.href = "/sign-in"
		}
	})
}
