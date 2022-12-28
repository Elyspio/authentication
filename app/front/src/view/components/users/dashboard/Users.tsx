import React, { useCallback, useEffect, useMemo } from "react";
import { Chip, Paper, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AuthenticationRoles, User } from "../../../../core/apis/backend/generated";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { usePermissions } from "../../../hooks/usePermissions";
import { getAllUsers, updateUser } from "../../../../store/module/users/users.async.action";
import IconButton from "@mui/material/IconButton";
import { PersonAdd, PersonOff } from "@mui/icons-material";
import { getEditUserLocation } from "../../../../core/services/router.service";

type Row = Record<Field, any>;

export function Users() {
	const dispatch = useAppDispatch();

	const allUsers = useAppSelector((s) => s.users.all);

	const users = useMemo(() => Object.values(allUsers), [allUsers]);

	const rows = useMemo(
		(): Row[] =>
			users.map((u) => ({
				createdAt: new Date(u.createdAt),
				disabled: u.disabled,
				docker: !!u.credentials.docker,
				github: !!u.credentials.github,
				id: u.id,
				lastConnection: u.lastConnection ? new Date(u.lastConnection) : null,
				roles: u.authorizations.authentication.roles,
				username: u.username,
			})),
		[users]
	);

	const { palette } = useTheme();

	const { isAdmin } = usePermissions();

	useEffect(() => {
		if (isAdmin && users.length === 0) dispatch(getAllUsers());
	}, [isAdmin, dispatch, users]);

	const editUser = useCallback((id: User["id"]) => dispatch(getEditUserLocation(id)), [dispatch]);

	const toggleDisabled = useCallback(
		(id: User["id"]) => (e: React.ChangeEvent<any>) => {
			e.stopPropagation();
			return dispatch(
				updateUser({
					...allUsers[id],
					disabled: !allUsers[id].disabled,
				})
			);
		},
		[dispatch, allUsers]
	);

	const columns = useMemo(() => {
		let cols: ColumnDef[] = [
			{
				field: "username",
				headerName: "Username",
				width: 180,
				sortable: true,
				headerAlign: "left",
			},
			{
				field: "disabled",
				headerName: "Activated",
				width: 100,
				type: "boolean",
				valueGetter: (params) => !params.value,
			},
			{
				field: "createdAt",
				headerName: "Created",
				width: 180,
				sortable: true,
				type: "dateTime",
			},
			{
				field: "lastConnection",
				headerName: "Last Connection",
				width: 180,
				sortable: true,
				type: "dateTime",
			},
			{
				field: "roles",
				headerName: "Roles",
				width: 180,
				renderCell: (params) => {
					const roles = params.value as AuthenticationRoles[];
					return (
						<Stack direction={"row"} spacing={1}>
							{roles.map((r) => (
								<Chip key={r} label={r} color={r === AuthenticationRoles.Admin ? "secondary" : "default"} />
							))}
						</Stack>
					);
				},
			},
			{
				field: "github",
				headerName: "Github",
				width: 100,
				type: "boolean",
			},
			{
				field: "docker",
				headerName: "Docker",
				width: 100,
				type: "boolean",
			},
			{
				field: "id",
				headerName: "Actions",
				width: 120,
				renderCell: (params) => {
					const row: Row = params.row;

					return (
						<Stack direction={"row"} spacing={1} justifyContent={"space-evenly"} width={"100%"}>
							{row.disabled ? (
								<Tooltip title={"Activate"} onClick={toggleDisabled(row.id)} arrow placement={"right"}>
									<IconButton>
										<PersonAdd />
									</IconButton>
								</Tooltip>
							) : (
								<Tooltip title={"Deactivate"} onClick={toggleDisabled(row.id)} arrow placement={"right"}>
									<IconButton color={"error"}>
										<PersonOff />
									</IconButton>
								</Tooltip>
							)}
						</Stack>
					);
				},
			},
		];

		cols.forEach((col) => {
			col.sortable ??= false;
			col.hideable ??= false;
			col.headerAlign ??= "center";
			col.disableColumnMenu ??= true;
		});

		return cols;
	}, [toggleDisabled]);

	return (
		<Paper>
			<Stack spacing={4} px={3} p={2}>
				<Typography variant={"h6"} fontSize={"120%"}>
					Users
				</Typography>
				<DataGrid
					onRowClick={({ row }) => editUser(row.id)}
					columns={columns}
					rows={rows}
					autoHeight
					isCellEditable={() => false}
					showCellRightBorder={false}
					showColumnRightBorder={false}
					rowsPerPageOptions={[100]}
					isRowSelectable={() => false}
					sx={{
						".MuiDataGrid-columnHeaders": {
							backgroundColor: palette.background.default,
						},
						width: columns.reduce((acc, cur) => acc + (cur.width ?? 0), 1.5),
					}}
				/>
			</Stack>
		</Paper>
	);
}

type Field = "id" | "username" | "roles" | "docker" | "github" | "disabled" | "createdAt" | "lastConnection";

type ColumnDef = { field: Field } & GridColDef;
