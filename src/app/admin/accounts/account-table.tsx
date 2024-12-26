'use client'

import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
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
import { useDeleteUserMutation, useGetAllUserQuery } from '@/queries/useAdmin'
import AddUser from './add-account'
import EditUser from './edit-account'
import { toast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'

type AccountItem = AccountListResType['data'][0]

const AccountTableContext = createContext<{
  setUserIdEdit: (value: number) => void
  userIdEdit: number | undefined
  userDelete: AccountItem | null
  setUserDelete: (value: AccountItem | null) => void
}>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUserIdEdit: (value: number | undefined) => {},
  userIdEdit: undefined,
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
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>
  },
  {
    accessorKey: 'phone',
    header: 'Điện thoại'
  },
  {
    id: 'Hành động',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setUserIdEdit, setUserDelete } = useContext(AccountTableContext)
      const openEditUser = () => {
        setUserIdEdit(row.original.id)
      }

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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditUser}>Sửa</DropdownMenuItem>
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
  const { mutateAsync } = useDeleteUserMutation()
  const deleteAccount = async () => {
    if (userDelete) {
      try {
        const result = await mutateAsync(userDelete.id.toString())
        setUserDelete(null)
        toast({
          title: 'Thành công',
          description: result.payload.message ?? 'Xoá người dùng thành công',
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
          <AlertDialogTitle>Xóa người dùng?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <span className="bg-foreground text-primary-foreground rounded px-1">{userDelete?.name}</span> sẽ
            bị xóa vĩnh viễn
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
export default function AccountTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [userIdEdit, setUserIdEdit] = useState<number | undefined>()
  const [userDelete, setUserDelete] = useState<AccountItem | null>(null)
  const getAllUserQuery = useGetAllUserQuery()
  const data = getAllUserQuery.data?.payload.data ?? []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

  const handleCreateUserSuccess = async () => {
    await getAllUserQuery.refetch()
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
    <AccountTableContext.Provider value={{ userIdEdit, setUserIdEdit, userDelete, setUserDelete }}>
      <div className="w-full">
        <EditUser id={userIdEdit} setId={setUserIdEdit} onSubmitSuccess={handleCreateUserSuccess} />
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
          <div className="ml-auto flex items-center gap-2">
            <AddUser onSubmitSuccess={handleCreateUserSuccess} />
          </div>
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
              pathname="/admin/accounts"
            /> */}
          </div>
        </div>
      </div>
    </AccountTableContext.Provider>
  )
}
