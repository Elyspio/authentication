import React from "react";
import { Stack } from "@mui/material";
import { Users } from "./Users";

export function Dashboard() {
	return (
		<Stack className={"maxHeightWidth"} alignItems={"center"} justifyContent={"center"}>
			<Users />
		</Stack>
	);
}
