import React from "react";
import { ActionComponent, ActionComponentProps, ActionDescription, ActionDescriptionProps } from "./actions/Action";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { Drawer } from "./Drawer";
import "./actions/Actions.scss";
import store from "@store";
import { changeLocation } from "@services/router.service";

export type ModalAction = {
	component: ActionComponentProps;
	description: ActionDescriptionProps;
	key?: string;
};

export type WithDrawerProps = {
	component: React.ReactNode;
	actions: ModalAction[];
	title: string;
};

function Actions(props: { elements: WithDrawerProps["actions"] }) {
	return (
		<Stack className={"Actions"} spacing={0.5} m={0.5}>
			{props.elements.map((action) => (
				<ActionComponent key={action.key ?? action.description.children?.toString()} {...action.component}>
					<ActionDescription children={action.description.children} />
				</ActionComponent>
			))}
		</Stack>
	);
}

export function withDrawer({ component, title, actions }: WithDrawerProps) {
	const goToHome = () => store.dispatch(changeLocation("dashboard"));

	return (
		<Box className={"Drawer-hoc"}>
			<Paper elevation={1} color={"red"}>
				<Grid className={"header"} alignItems={"center"} justifyContent={"center"} container>
					<Grid item>
						<Typography variant={"h4"} align={"center"} onClick={goToHome} sx={{ cursor: "pointer" }}>
							{title}
						</Typography>
					</Grid>
				</Grid>
			</Paper>

			<Drawer position={"right"} actionsComponent={<Actions elements={actions} />}>
				<div className="content">{component}</div>
			</Drawer>
		</Box>
	);
}

export function createDrawerAction(name: string, config: ActionComponentProps): WithDrawerProps["actions"][number] {
	return {
		description: { children: name },
		component: config,
	};
}

export function createDrawerDivider(name: string): WithDrawerProps["actions"][number] {
	return {
		description: { children: null },
		key: name,
		component: {
			divider: name,
			onClick: () => {
				// empty
			},
			icon: null,
		},
	};
}
