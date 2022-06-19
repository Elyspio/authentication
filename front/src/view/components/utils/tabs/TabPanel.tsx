import { Box } from "@mui/material";
import React from "react";

export function TabPanel(props: { children: React.ReactChild; index: number; value: number }) {
	const { children, value, index, ...other } = props;

	return (
		<div role="tabpanel" hidden={value !== index} id={`scrollable-auto-tabpanel-${index}`} aria-labelledby={`scrollable-auto-tab-${index}`} {...other}>
			{value === index && <Box>{children}</Box>}
		</div>
	);
}
