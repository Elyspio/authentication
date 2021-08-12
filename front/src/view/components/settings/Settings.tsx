import React from 'react';
import {useAppDispatch, useAppSelector} from "../../../store";
import {UserSettingsModel, UserSettingsModelThemeEnum} from "../../../core/apis/backend";
import {Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select} from "@material-ui/core";
import {push} from "connected-react-router";
import {applicationPaths} from "../../../config/routes";
import Divider from "@material-ui/core/Divider";
import {Title} from "../utils/title";
import "./Settings.scss"
import {setUserSettings} from "../../../store/module/authentication/authentication.action";

export function SettingContainer() {

	const dispatch = useAppDispatch();

	const changePath = path => () => dispatch(push(path));

	const {logged, settings} = useAppSelector(s => s.authentication)

	return (
		<Grid container justifyContent={"center"} alignItems={"center"}>
			<Grid item>
				<Paper>
					{logged && settings
						? <Settings/>
						: <Button onClick={changePath(applicationPaths.home)}>You are not logged, please login first</Button>}
				</Paper>
			</Grid>
		</Grid>


	);
}


function Settings() {

	const {settings: actualSettings, username} = useAppSelector(s => s.authentication)
	const [newSettings, setNewSettings] = React.useState<UserSettingsModel>(actualSettings!)

	const setProperty = React.useCallback(<T extends keyof UserSettingsModel>(key: T) => (val: any) => {
		setNewSettings({
			...newSettings,
			[key]: val.target.value
		})
	}, [newSettings])

	const dispatch = useAppDispatch();

	const save = React.useCallback(() => username && dispatch(setUserSettings({
		settings: {
			theme: newSettings.theme as any
		},
		username
	})), [newSettings, dispatch, username])

	return <Paper className={"Settings"}>

		<Grid container direction={"column"} alignItems={"center"} spacing={6}>

			<Grid item xs={12} container alignItems={"center"} direction={"column"}>
				<Title>Settings</Title>
				<Divider className={"Divider"}/>
			</Grid>

			<Grid item xs={12}>
				<FormControl fullWidth>
					<InputLabel id="settings-theme-label">Theme</InputLabel>
					<Select
						labelId="settings-theme-label"
						id="settings-theme-select"
						value={newSettings.theme}
						label="Theme"
						fullWidth
						onChange={setProperty("theme")}
					>
						<MenuItem value={UserSettingsModelThemeEnum.Light.toString()}>Light</MenuItem>
						<MenuItem value={UserSettingsModelThemeEnum.Dark.toString()}>Dark</MenuItem>
						<MenuItem value={UserSettingsModelThemeEnum.System.toString()}>System</MenuItem>
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12} container justifyContent={"center"}>
				<Button color={"primary"} variant={"outlined"} onClick={save}>Save</Button>
			</Grid>
		</Grid>


	</Paper>

}

export default Settings;
