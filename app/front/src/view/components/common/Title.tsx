import React, { ReactNode } from "react";
import { PropTypes, Typography } from "@mui/material";

type TitleProps = {
	children: ReactNode;
	color?: PropTypes.Color | string;
};

export function Title({ children, color = "primary" }: TitleProps) {
	return (
		<Typography fontSize={"120%"} color={color} variant={"overline"}>
			{children}
		</Typography>
	);
}
