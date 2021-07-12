import React, {ReactNode} from 'react';
import {IconButton, Typography} from "@material-ui/core";
import {WithDrawerProps} from "../Drawer.hoc";

export type ActionComponentProps = {
	icon: React.ReactNode,
	children?: React.ReactNode,
	className?: string,
	onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const ActionComponent = ({children, icon, onClick, className}: ActionComponentProps) => {

	return (
		<div className={"Action " + (className ?? "")} onClick={onClick}>
			<div className={"icon"}><IconButton>{icon}</IconButton></div>
			<div className={"description"}>{children}</div>
		</div>
	);
};

export type ActionDescriptionProps = { children: ReactNode };
export const ActionDescription = (props: ActionDescriptionProps) => <Typography
	className={"MuiButton-label ActionDescription"}>
	{props.children}
</Typography>

export function createDrawerAction(name: string, config: ActionComponentProps): WithDrawerProps["actions"][number] {
	return {
		description: {children: name},
		component: config
	}
}
