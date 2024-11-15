"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

const Navbar = () => {
	const [loginText, setLoginText] = useState("Log In")
	const [isSuperuser, setIsSuperuser] = useState<string | null>("false")

	useEffect(() => {
		const token = localStorage.getItem("token")
		setIsSuperuser(localStorage.getItem("is_superuser"))
		if (token) {
			setLoginText("Log Out")
		} else {
			setLoginText("Log In")
		}
	})

	const handleLogIn = () => {
		const token = localStorage.getItem("token")
		if (token) {
			localStorage.removeItem("token")
			localStorage.removeItem("is_superuser")
			setLoginText("Sign In")
			console.log("token removed")
		}
		if (!window.location.href.includes("/sign-in")) {
			console.log(window.location.href)
			window.location.href = "/sign-in"
		}
	}

	return (
		<>
			<div className="w-full h-20 bg-emerald-800 sticky top-0">
				<div className="container mx-auto px-4 h-full">
					<div className="flex justify-between items-center h-full">
						<ul className="hidden md:flex gap-x-6 text-white">
							<li>
								<Link href="/files">
									<p>Files</p>
								</Link>
							</li>
							{isSuperuser && (
								<li>
									<Link href="/admin">
										<p>Admin Dashboard</p>
									</Link>
								</li>
							)}
						</ul>
						<Button onClick={handleLogIn} type="submit">
							{loginText}
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}

export default Navbar
