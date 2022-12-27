import React, { useEffect, useMemo } from "react";
import { Chip, Paper, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AuthenticationRoles } from "../../../core/apis/backend/generated";
import { useAppDispatch, useAppSelector } from "../../../store";
import { usePermissions } from "../../hooks/usePermissions";
import { getAllUsers } from "../../../store/module/users/users.async.action";
import IconButton from "@mui/material/IconButton";
import { Edit, PersonAdd, PersonOff } from "@mui/icons-material";

export function Users() {
	const dispatch = useAppDispatch();

	const allUsers = useAppSelector((s) => s.users.all);

	const users = useMemo(() => Object.values(allUsers), [allUsers]);

	const rows = useMemo(
		(): Record<Field, any>[] =>
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

	const columns = useMemo(() => getColumns(dispatch), [dispatch]);

	return (
		<Paper>
			<Stack spacing={4} px={3} p={2}>
				<Typography variant={"h6"} fontSize={"120%"}>
					Users
				</Typography>
				<DataGrid
					columns={columns}
					rows={rows}
					autoHeight
					isCellEditable={() => false}
					showCellRightBorder={true}
					showColumnRightBorder={true}
					rowsPerPageOptions={[100]}
					sx={{
						".MuiDataGrid-columnHeaders": {
							backgroundColor: palette.background.default,
						},
						width: columns.reduce((acc, cur) => acc + (cur.width ?? 0), 5),
					}}
				/>
			</Stack>
		</Paper>
	);
}

const getColumns = (dispatch: ReturnType<typeof useAppDispatch>): ColumnDef[] => {
	let cols: ColumnDef[] = [
		{
			field: "username",
			headerName: "Username",
			width: 180,
			sortable: true,
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
			width: 150,
			renderCell: (params) => {
				return (
					<Stack direction={"row"} spacing={1}>
						<IconButton color={"primary"}>
							<Edit />
						</IconButton>

						{params.row.disabled ? (
							<Tooltip title={"Activate"} followCursor>
								<IconButton>
									<PersonAdd />
								</IconButton>
							</Tooltip>
						) : (
							<Tooltip title={"Deactivate"} followCursor>
								<IconButton color={"error"}>
									{" "}
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
		col.headerAlign ??= "left";
		col.disableColumnMenu ??= true;
	});

	return cols;
};

type Field = "id" | "username" | "roles" | "docker" | "github" | "disabled" | "createdAt" | "lastConnection";

type ColumnDef = { field: Field } & GridColDef;
