'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { AccountListResType, AccountType } from '@/schemaValidations/account.schema'
// import AddEmployee from '@/app/manage/accounts/add-employee'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import EditEmployee from '@/app/manage/accounts/edit-employee'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useSearchParams } from 'next/navigation'
// import AutoPagination from '@/components/auto-pagination'
import { AccountListResType, AccountType } from '@/types/inputBodys/admin.body'
import { useDeleteRoomMutation, useGetAllRoomQuery } from '@/queries/useAdmin'
import { toast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'

type AccountItem = AccountListResType['data'][0]

const AccountTableContext = createContext<{
  userDelete: AccountItem | null
  setUserDelete: (value: AccountItem | null) => void
}>({
  userDelete: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUserDelete: (value: AccountItem | null) => {}
})

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'Trạng thái',
    header: 'is_active'
  },
  {
    id: 'Hành động',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setUserDelete } = useContext(AccountTableContext)
      const openDeleteUser = () => {
        setUserDelete(row.original)
      }
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openDeleteUser}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteAccount({
  userDelete,
  setUserDelete,
  onSubmitSuccess
}: {
  userDelete: AccountItem | null
  setUserDelete: (value: AccountItem | null) => void
  onSubmitSuccess: () => void
}) {
  const { mutateAsync } = useDeleteRoomMutation()
  const deleteAccount = async () => {
    if (userDelete) {
      try {
        const result = await mutateAsync(userDelete.id.toString())
        setUserDelete(null)
        toast({
          title: 'Thành công',
          description: result.payload.message ?? 'Xoá phòng thành công',
          className: 'bg-green-500 text-white'
        })
        onSubmitSuccess()
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(userDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setUserDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa phòng?</AlertDialogTitle>
          <AlertDialogDescription>
            Phòng<span className="bg-foreground text-primary-foreground rounded px-1">{userDelete?.name}</span> sẽ bị
            xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction onClick={deleteAccount}>Đồng ý</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function RoomTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [userDelete, setUserDelete] = useState<AccountItem | null>(null)
  const getAllRoomQuery = useGetAllRoomQuery()
  const data = getAllRoomQuery.data?.payload.data ?? []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

  const handleCreateUserSuccess = async () => {
    await getAllRoomQuery.refetch()
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])
  return (
    <AccountTableContext.Provider value={{ userDelete, setUserDelete }}>
      <div className="w-full">
        <AlertDialogDeleteAccount
          userDelete={userDelete}
          setUserDelete={setUserDelete}
          onSubmitSuccess={handleCreateUserSuccess}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2"></div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-xs text-muted-foreground py-4 flex-1 ">
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong <strong>{data.length}</strong>{' '}
            kết quả
          </div>
          <div>
            {/* <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/admin/rooms"
            /> */}
          </div>
        </div>
      </div>
    </AccountTableContext.Provider>
  )
}
