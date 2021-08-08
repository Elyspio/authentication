import React from 'react';
import {useAppSelector} from "../../../store";
import {UserSettingsModel} from "../../../core/apis/backend";

function Settings() {

	const {settings: actualSettings, logged} = useAppSelector(s => s.authentication)
	const [newSettings] = React.useState<UserSettingsModel>(actualSettings!)


	return (
		<div></div>
	);
}

export default Settings;
