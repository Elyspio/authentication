import React, { ReactNode } from "react";
import { Typography, TypographyProps } from "@mui/material";

type TitleProps = {
	children: ReactNode;
	color?: TypographyProps["color"];
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
