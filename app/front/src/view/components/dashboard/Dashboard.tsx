import React from "react";
import { Paper, Stack, Typography } from "@mui/material";

type DashboardProps = {};

export function Dashboard({}: DashboardProps) {
	return (
		<Stack height={"100%"} m={2}>
			<Paper>
				<Stack p={2} spacing={2} minWidth={300} alignItems={"center"}>
					<Typography variant={"h6"}>Dashboard</Typography>
				</Stack>
			</Paper>
		</Stack>
	);
}
