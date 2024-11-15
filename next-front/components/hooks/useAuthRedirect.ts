"use client"

import { useEffect } from "react"

export default function useAuthRedirect() {
	useEffect(() => {
		const token = localStorage.getItem("token")
		console.log(token, "Redirect")
		if (token) {
			const is_superuser = localStorage.getItem("is_superuser")
			if (is_superuser) {
				window.location.href = "/admin"
			} else {
				window.location.href = "/files"
			}
		}
	})
}
