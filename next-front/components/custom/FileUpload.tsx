import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import axiosClient from "@/lib/axiosClient"
import { Upload } from "lucide-react"
import { useRef } from "react"

const UploadFile = () => {
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const formData = new FormData()
			formData.append("file", file)

			axiosClient
				.post("/files/", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					console.log("File uploaded successfully:", response.data)
					location.reload()
				})
				.catch((error) => {
					console.error("Error uploading file:", error)
				})
		}
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Upload File</CardTitle>
					<CardDescription>Upload new files to the system</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center space-x-4">
						<Input
							type="file"
							className="w-full"
							ref={fileInputRef}
							onChange={handleFileUpload}
						/>
						<Button onClick={() => fileInputRef.current?.click()}>
							<Upload /> Upload
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	)
}

export default UploadFile
