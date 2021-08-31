import {getCurrentTheme} from "../../../config/theme";
import {ThemeState} from "../../../store/module/theme/theme.reducer";

export function updateToastTheme(theme: ThemeState["current"]) {
	const {palette} = getCurrentTheme(theme);
	const css = `
    .Toastify__toast--default {
        background-color: ${palette.background.default}
    }
    .Toastify__toast--info {
        background-color: ${palette.info[theme]}
    }
    .Toastify__toast--success {
        background-color: ${palette.success[theme]}
    }
    .Toastify__toast--warning {
        background-color: ${palette.warning[theme]}
    }
    .Toastify__toast--error {
        background-color: ${palette.error[theme]}
    }
    `
	const id = "style-toastify";
	let el = window.document.querySelector(`#${id}`)
	if (el === null) {
		el = window.document.createElement("style")
		el.id = id
		window.document.head.appendChild(el);
	}
	el.innerHTML = css;
}

