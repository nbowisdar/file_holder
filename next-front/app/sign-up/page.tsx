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
	const [confirmPassword, setConfirmPassword] = useState("")
	const [errMsg, setErrMsg] = useState("")

	const { push } = useRouter()

	const handleSubmit = (e: React.FormEvent) => {
		setErrMsg("")
		e.preventDefault()
		if (password !== confirmPassword) {
			setErrMsg("Passwords don't match!")
			return
		}
		console.log("Sign up attempted with:", { username, password })

		axiosClient
			.post(`/users/signup`, {
				username: username,
				password: password,
			})
			.then(function (response) {
				push("/sign-in")
			})
			.catch(function (error) {
				setErrMsg("Something went wrong!")
			})
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
					<CardDescription>Create a new account.</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="Choose a username"
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
								placeholder="Choose a password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirm-password">Confirm Password</Label>
							<Input
								id="confirm-password"
								type="password"
								placeholder="Confirm your password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						{errMsg ? AlertDestructive({ msg: errMsg }) : null}
						<Button type="submit" className="w-full">
							Sign Up
						</Button>
						<p className="text-sm text-center text-gray-600">
							Already have an account?
							<Link
								href="/sign-in"
								className="text-blue-600 hover:underline ml-1"
							>
								Sign In
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}
