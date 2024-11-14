"use client"
import { AlertDestructive } from "@/components/custom/AlertDestructive"
import useAuthRedirect from "@/components/hooks/useAuthRedirect"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosClient from "@/lib/axiosClient"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function page() {
	useAuthRedirect()

	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [errMsg, setErrMsg] = useState("")
	const { push } = useRouter()

	const handleSubmit = (e: React.FormEvent) => {
		setErrMsg("")
		e.preventDefault()
		console.log("Sign in attempted with:", { username, password })

		const formData = new FormData()
		formData.append("username", username)
		formData.append("password", password)
		formData.append("grant_type", "password")
		axiosClient
			.post(`$/login/access-token`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then(function (response) {
				localStorage.setItem("token", response.data.access_token)
				localStorage.setItem("is_superuser", response.data.is_superuser)
				if (response.data.is_superuser) {
					console.log("admin")
					push("/admin")
				} else {
					console.log("user")
					push("/files")
				}
			})
			.catch(function (error) {
				setErrMsg("Something went wrong!")
			})
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
					<CardDescription>
						Enter your username and password to sign in.
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="Enter your username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						{errMsg ? AlertDestructive({ msg: errMsg }) : null}
						<Button type="submit" className="w-full">
							Sign In
						</Button>
						<p className="text-sm text-center text-gray-600">
							Don't have an account?
							<Link
								href="/sign-up"
								className="text-blue-600 hover:underline ml-1"
							>
								Sign Up
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}
