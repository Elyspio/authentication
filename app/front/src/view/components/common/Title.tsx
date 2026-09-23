import React, { ReactNode } from "react";
import { PropTypes, Typography } from "@mui/material";

type TitleProps = {
	children: ReactNode;
	color?: PropTypes.Color | string;
};

export function Title({ children, color = "primary" }: TitleProps) {
	return (
		<Typography
			color={color}
			variant={"overline"}
			sx={{
				fontSize: "120%",
			}}
		>
			{children}
		</Typography>
	);
}
