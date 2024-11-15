"use client"

import DetailAdmin from "@/components/custom/DetailAdmin"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import axiosClient from "@/lib/axiosClient"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"
import { useEffect, useState } from "react"

type File = {
	id: number
	name: string
	created_at: string
	size: number | string
	download_count: number
}

const Files = ({ isAdmin = false }: { isAdmin: boolean }) => {
	const [files, setFiles] = useState<File[]>([])
	const [itemsPerPage, setItemsPerPage] = useQueryState(
		"totalItems",
		parseAsInteger.withDefault(5)
	)

	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

	// Pagination logic
	const indexOfLastItem = page * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const [totalPages, setTotalPages] = useState(1)

	const paginate = (pageNumber: number) => setPage(pageNumber)

	function loadFiles() {
		axiosClient
			.get<{ data: File[]; count: number }>("/files", {
				params: { limit: itemsPerPage, offset: (page - 1) * itemsPerPage },
			})
			.then((response) => {
				const files = response.data.data
				setTotalPages(Math.ceil(response.data.count / itemsPerPage))
				files.forEach((file) => improveFile(file))
				setFiles(files)
			})
	}

	useEffect(() => {
		loadFiles()
	}, [page, itemsPerPage])

	function improveFile(file: File) {
		file.created_at = new Date(file.created_at).toISOString().split("T")[0]
		file.size = `${((file.size as number) / 1024 / 1024).toFixed(2)} MB`
	}

	const handleDownload = (fileId: number) => {
		axiosClient
			.get(`/files/${fileId}`, { responseType: "blob" })
			.then((response) => {
				const fileName = response.headers["content-disposition"]
					?.split("filename=")[1]
					?.replace(/"/g, "")

				// Create a temporary link to trigger the download
				const link = document.createElement("a")
				link.href = URL.createObjectURL(response.data)
				link.download = fileName || `file_${fileId}` // Use file name or default name
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link) // Clean up the DOM

				setFiles((prevFiles) =>
					prevFiles.map((file) => {
						if (file.id === fileId) {
							return {
								...file,
								download_count: file.download_count + 1,
							}
						}
						return file
					})
				)
			})
			.catch((error) => {
				console.error("Error downloading the file:", error)
			})
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>File Management</CardTitle>
					<CardDescription>
						Manage uploaded files and their permissions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>File Name</TableHead>
								<TableHead>Upload Date</TableHead>
								<TableHead>Size</TableHead>
								<TableHead>Download Count</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{files.map((file) => (
								<TableRow key={file.id}>
									<TableCell className="font-medium">{file.name}</TableCell>
									<TableCell>{file.created_at}</TableCell>
									<TableCell>{file.size}</TableCell>
									<TableCell>{file.download_count}</TableCell>
									<TableCell>
										<div className="flex space-x-2">
											{isAdmin && <DetailAdmin file={file} />}
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleDownload(file.id)}
											>
												<Download className="mr-2 h-4 w-4" /> Download
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
						<div className="flex items-center space-x-2">
							<span>Show</span>
							<Select
								value={itemsPerPage.toString()}
								onValueChange={(value) => setItemsPerPage(Number(value))}
							>
								<SelectTrigger className="w-[70px]">
									<SelectValue placeholder="5" />
								</SelectTrigger>
								<SelectContent>
									{[1, 5, 10, 20, 50].map((number) => (
										<SelectItem key={number} value={number.toString()}>
											{number}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<span>per page</span>
						</div>
						<div>
							Showing {indexOfFirstItem + 1}-
							{Math.min(indexOfLastItem, files.length)} of {files.length} files
						</div>
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => paginate(page - 1)}
								disabled={page === 1}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(number) => (
									<Button
										key={number}
										variant={page === number ? "default" : "outline"}
										size="sm"
										onClick={() => paginate(number)}
									>
										{number}
									</Button>
								)
							)}
							<Button
								variant="outline"
								size="sm"
								onClick={() => paginate(page + 1)}
								disabled={page === totalPages}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	)
}

export default Files
