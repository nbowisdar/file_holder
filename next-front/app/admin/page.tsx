'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Download, File as FileIcon, Plus, X, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import axiosClient from '@/lib/axiosClient'
import { parseAsInteger, useQueryState } from "nuqs";
import { useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from '@/components/custom/Combobox'


type File = {
  id: number
  name: string
  created_at: string
  size: number | string
  download_count: number
}

type User = {
  id: number
  name: string
}

type Permission = {
  fileId: number
  userId: number
}

type SearchParams = {
  // [key: string]: string
  page: string | undefined
  offset: string | undefined
}

// export default function AdminDashboard({page}: SearchParams ) {
export default function AdminDashboard() {
  const [files, setFiles] = useState<File[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])

  const [itemsPerPage, setItemsPerPage] = useQueryState(
    "totalItems",
    parseAsInteger.withDefault(1)
  );
  
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  
  
  // Pagination logic
  const indexOfLastItem = page * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem)
  // const totalPages = Math.ceil(files.length / itemsPerPage)
  const [totalPages, setTotalPages] = useState(1)

  
  const paginate = (pageNumber: number) => setPage(pageNumber)


  const DEFAULT_TOTAL_ITEMS = 2;

  const searchParams = useSearchParams();

  // const [currentSearch, setCurrentSearch] = useQueryState("search", {
  //   defaultValue: "",
  // });


  // const search = searchParams.get("search");
  useEffect(() => {
    axiosClient.get<{data: File[], count: number}>('/files', 
      {params: {limit: itemsPerPage, offset: (page - 1) * itemsPerPage}}
    )
      .then((response) => {
        const files = response.data.data
        setTotalPages(Math.ceil(response.data.count / itemsPerPage))
        files.forEach(file => improveFile(file))
        setFiles(files)
      }).finally(() => {
      })

  }, [page, itemsPerPage]);


  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'David' },
    { id: 5, name: 'Eve' },
  ])

  const [permissions, setPermissions] = useState<Permission[]>([
    { fileId: 1, userId: 1 },
    { fileId: 1, userId: 2 },
    { fileId: 2, userId: 1 },
    { fileId: 2, userId: 3 },
  ])

  useEffect(() => {
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedFile || !permissions.some(permission => 
        permission.fileId === selectedFile.id && permission.userId === user.id
      ))
    )
    setSearchResults(results)
  }, [searchTerm, users, permissions, selectedFile])

  function improveFile(file: File) {
    file.created_at = new Date(file.created_at).toISOString().split('T')[0]
    file.size = `${(file.size as number / 1024 / 1024).toFixed(2)} MB`
  }
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    
  }

  const handleDownload = (fileId: number) => {
    setFiles(files.map(file => 
      file.id === fileId
        ? { ...file, download_count: file.download_count + 1 }
        : file
    ))
  }

  const getUsersWithAccess = (fileId: number) => {
    return users.filter(user => 
      permissions.some(permission => permission.fileId === fileId && permission.userId === user.id)
    )
  }

  const addUserAccess = (fileId: number, userId: number) => {
    setPermissions([...permissions, { fileId, userId }])
    setSearchTerm('')
  }

  const removeUserAccess = (fileId: number, userId: number) => {
    setPermissions(permissions.filter(
      permission => !(permission.fileId === fileId && permission.userId === userId)
    ))
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>Upload new files to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input 
              type="file" 
              onChange={handleFileUpload}
              className="w-full"
            />
            <Button>
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
          <CardDescription>Manage uploaded files and their permissions</CardDescription>
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
                      <Dialog onOpenChange={(open) => {
                        if (open) {
                          setSelectedFile(file)
                        } else {
                          setSelectedFile(null)
                          setSearchTerm('')
                        }
                      }}>
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
                                {getUsersWithAccess(file.id).map((user) => (
                                  <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
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
                                <Combobox fileId={file.id}/>
                                  {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Search users"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                  /> */}
                                </div>
                              </div>
                              {searchTerm && (
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
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(file.id)}>
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
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, files.length)} of {files.length} files
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <Button
                  key={number}
                  variant={page === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(number)}
                >
                  {number}
                </Button>
              ))}
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
    </div>
  )
}