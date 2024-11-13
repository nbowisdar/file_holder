import {
    Container,
    Heading,
    SkeletonText,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
  } from "@chakra-ui/react"
  import { useQuery, useQueryClient } from "@tanstack/react-query"
  import { createFileRoute, useNavigate } from "@tanstack/react-router"
  import { useEffect } from "react"
  import { z } from "zod"
  
  import { FilesService } from "../../client"
  import ActionsMenu from "../../components/Common/ActionsMenu"
  import Navbar from "../../components/Common/Navbar"
  import AddItem from "../../components/Files/AddItem"
  import { PaginationFooter } from "../../components/Common/PaginationFooter.tsx"
  
  const filesSearchSchema = z.object({
    page: z.number().catch(1),
  })
  
  export const Route = createFileRoute("/_layout/files")({
    component: Files,
    validateSearch: (search) => filesSearchSchema.parse(search),
  })
  
  const PER_PAGE = 5
  
  function getFilesQueryOptions({ page }: { page: number }) {
    return {
      queryFn: () =>
        FilesService.readFiles({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
      queryKey: ["files", { page }],
    }
  }
  
  function FilesTable() {
    const queryClient = useQueryClient()
    const { page } = Route.useSearch()
    const navigate = useNavigate({ from: Route.fullPath })
    const setPage = (page: number) =>
      navigate({ search: (prev: {[key: string]: string}) => ({ ...prev, page }) })
  
    const {
      data: files,
      isPending,
      isPlaceholderData,
    } = useQuery({
      ...getFilesQueryOptions({ page }),
      placeholderData: (prevData) => prevData,
    })
  
    const hasNextPage = !isPlaceholderData && files?.data.length === PER_PAGE
    const hasPreviousPage = page > 1
  
    useEffect(() => {
      if (hasNextPage) {
        queryClient.prefetchQuery(getFilesQueryOptions({ page: page + 1 }))
      }
    }, [page, queryClient, hasNextPage])
  
    return (
      <>
        <TableContainer>
          <Table size={{ base: "sm", md: "md" }}>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            {isPending ? (
              <Tbody>
                <Tr>
                  {new Array(4).fill(null).map((_, index) => (
                    <Td key={index}>
                      <SkeletonText noOfLines={1} paddingBlock="16px" />
                    </Td>
                  ))}
                </Tr>
              </Tbody>
            ) : (
              <Tbody>
                {files?.data.map((item) => (
                  <Tr key={item.id} opacity={isPlaceholderData ? 0.5 : 1}>
                    <Td>{item.id}</Td>
                    <Td isTruncated maxWidth="150px">
                      {item.title}
                    </Td>
                    <Td
                      color={!item.description ? "ui.dim" : "inherit"}
                      isTruncated
                      maxWidth="150px"
                    >
                      {item.description || "N/A"}
                    </Td>
                    <Td>
                      <ActionsMenu type={"Item"} value={item} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
        </TableContainer>
        <PaginationFooter
          page={page}
          onChangePage={setPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      </>
    )
  }
  
  function Files() {
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
          Files Management
        </Heading>
  
        <Navbar type={"Item"} addModalAs={AddItem} />
        <FilesTable />
      </Container>
    )
  }
  