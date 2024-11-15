"use client"
import Files from "@/components/custom/Files"
import useRedirectToLogin from "@/components/hooks/useRedirectToLogin"
import { Suspense } from "react"

const FilesPage = () => {
	useRedirectToLogin()
	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold">Files</h1>
			<Suspense fallback={<div>Loading...</div>}>
				<Files isAdmin={false} />
			</Suspense>
		</div>
	)
}

export default FilesPage
