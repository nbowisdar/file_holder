"use client"

import Files from "@/components/custom/Files"
import FileUpload from "@/components/custom/FileUpload"
import useRedirectToLogin from "@/components/hooks/useRedirectToLogin"
import { Suspense } from "react"

export default function AdminPage() {
	useRedirectToLogin()

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold">Admin Dashboard</h1>
			<FileUpload />
			<Suspense fallback={<div>Loading...</div>}>
				<Files isAdmin={true} />
			</Suspense>
		</div>
	)
}
