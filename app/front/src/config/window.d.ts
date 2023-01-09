export type Config = {
	log?: true;
	endpoints: {
		core: string;
		authentication: string;
	};
	loginPageUrl: "http://localhost";
};

declare global {
	interface Window {
		config: Config;
	}
}
