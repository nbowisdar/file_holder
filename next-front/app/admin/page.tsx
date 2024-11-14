"use client"

import DetailAdmin from "@/components/custom/DetailAdmin"
import Files from "@/components/custom/Files"
import FileUpload from "@/components/custom/FileUpload"
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

// export default function AdminDashboard({page}: SearchParams ) {
export default function AdminDashboard() {
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

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold">Admin Dashboard</h1>
			<FileUpload />
			<Files isAdmin={true} />
		</div>
	)
}
