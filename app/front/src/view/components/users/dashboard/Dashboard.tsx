import React from "react";
import { Stack } from "@mui/material";
import { Users } from "./Users";
import { RequireRole } from "../../common/RequireRole";
import { AuthenticationRoles } from "@apis/backend/generated";
import { usePermissions } from "@hooks/usePermissions";

export function Dashboard() {
	const { isAdmin } = usePermissions();

	if (!isAdmin) return <RequireRole missing={AuthenticationRoles.Admin} />;

	return (
		<Stack
			className={"maxHeightWidth"}
			sx={{
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Users />
		</Stack>
	);
}
