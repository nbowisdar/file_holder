"use client"
import Files from "@/components/custom/Files"
import useRedirectToLogin from "@/components/hooks/useRedirectToLogin"

const page = () => {
	useRedirectToLogin()
	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold">Files</h1>
			<Files isAdmin={false} />
		</div>
	)
}

export default page
