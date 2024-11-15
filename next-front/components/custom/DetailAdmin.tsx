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
import axiosClient from "@/lib/axiosClient"
import { File as FileIcon, X } from "lucide-react"
import { useEffect, useState } from "react"

type User = {
	id: number
	username: string
}

type File = {
	id: number
	name: string
	created_at: string
	size: number | string
	download_count: number
}

const AdminDetail = ({ file }: { file: File }) => {
	const [users, setUsers] = useState<User[]>([])

	const removeUserAccess = (fileId: number, username: string) => {
		axiosClient
			.patch<{ data: File[]; count: number }>(
				"/files/access",
				{},
				{ params: { file_id: fileId, username: username, has_access: false } }
			)
			.then((res) => loadUsers())
			.catch((err) => console.log(err))
	}

	function loadUsers() {
		console.log("loading users")
		axiosClient
			.get<{ users: User[] }>(`/files/info/${file.id}`)
			.then((res) => setUsers(res.data.users))
	}
	useEffect(() => {
		loadUsers()
	}, [])
	return (
		<>
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
												onClick={() => removeUserAccess(file.id, user.username)}
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
									<Combobox fileId={file.id} loadUsers={loadUsers} />
								</div>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default AdminDetail
