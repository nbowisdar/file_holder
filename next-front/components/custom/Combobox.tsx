"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import axiosClient from "@/lib/axiosClient"
import { useEffect, useState } from "react"
import { useQueryState } from "nuqs"

const FormSchema = z.object({
	username: z.string({
		required_error: "Please select a user.",
	}),
})

export function Combobox({fileId}: {fileId: number}) {
	const [users, setUsers] = useState([])
	const [usersSearch, setUsersSearch] = useQueryState("usersSearch", {
		defaultValue: "",
	})

	useEffect(() => {
		axiosClient.get("/users").then((res) => {
			console.log(res.data)
			console.log(typeof users)
			setUsers(res.data.data.map((user: { username: string }) => user.username))
		})
	}, [usersSearch])

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
    axiosClient.patch<{data: File[], count: number}>('/files/access', 
      {}, {params: {file_id: fileId, username: data.username, has_access: true}},
    ).catch((err) => console.log(err))
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Users</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={cn(
												"w-[200px] justify-between",
												!field && "text-muted-foreground"
											)}
										>
											{field.value ? field.value : "Select user"}
											<ChevronsUpDown className="opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput
											placeholder="Search user..."
											className="h-9"
											onChangeCapture={(e) => {
												const target = e.target as HTMLInputElement
												console.log(target.value)
												setUsersSearch(target.value)
											}}
										/>
										<CommandList>
											<CommandEmpty>No user found.</CommandEmpty>
											<CommandGroup>
												{users.map((user) => (
													<CommandItem
														value={user}
														key={user}
														onSelect={() => {
															form.setValue("username", user)
														}}
													>
														{user}
														<Check
															className={cn(
																"ml-auto",
																user === field.value
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>

							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	)
}
