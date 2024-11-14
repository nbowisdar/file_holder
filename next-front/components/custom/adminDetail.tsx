import { Combobox } from "@/components/custom/Combobox"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Download, File as FileIcon, Plus, X } from "lucide-react"

// type File = {
// 	id: number
// 	name: string
// 	created_at: string
// 	size: number | string
// 	download_count: number
// }

interface File {
	id: number
	name: string
	created_at: string
	size: number | string
	download_count: number
}

const AdminDetail = ({ file }: { file: File }) => {
	function setSelectedFile(file: any) {
		console.log("Function not implemented.")
	}

	const handleDownload = (fileId: number) => {
		console.log("Download")
	}

	function setSearchTerm(arg0: string) {
		throw new Error("Function not implemented.")
	}

	type User = {
		id: number
		username: string
	}

	const users: User[] = []

	const removeUserAccess = (fileId: number, userId: number) => {
		console.log("Remove user access")
	}
	const addUserAccess = (fileId: number, userId: number) => {
		// setPermissions([...permissions, { fileId, userId }])
		// setSearchTerm("")
		console.log("Add user access")
	}

	return (
		<div className="flex space-x-2">
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="outline" size="sm">
						<FileIcon className="mr-2 h-4 w-4" /> Details
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>File Details: {file.name}</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<h3 className="mb-2 font-semibold">Users with Access</h3>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>User</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user.id}>
										<TableCell>{user.username}</TableCell>
										<TableCell>
											<Button
												variant="outline"
												size="sm"
												onClick={() => removeUserAccess(file.id, user.id)}
											>
												<X className="h-4 w-4" /> Remove
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<div className="mt-4">
							<h3 className="mb-2 font-semibold">Add User Access</h3>
							<div className="flex items-center space-x-2">
								<div className="relative w-full">
									<Combobox fileId={file.id} />
									{/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Search users"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                  /> */}
								</div>
							</div>
							{/* {searchTerm && (
								<ul className="mt-2 max-h-40 overflow-auto border rounded-md">
									{searchResults.map((user) => (
										<li
											key={user.id}
											className="p-2 hover:bg-muted cursor-pointer flex justify-between items-center"
											onClick={() => addUserAccess(file.id, user.id)}
										>
											{user.name}
											<Button size="sm" variant="ghost">
												<Plus className="h-4 w-4" />
											</Button>
										</li>
									))}
								</ul>
							)} */}
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<Button
				variant="outline"
				size="sm"
				onClick={() => handleDownload(file.id)}
			>
				<Download className="mr-2 h-4 w-4" /> Download
			</Button>
		</div>
	)
}

export default AdminDetail
