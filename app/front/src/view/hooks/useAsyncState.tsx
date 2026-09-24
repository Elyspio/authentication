import { useEffect, useState } from "react";

type UseAsyncStateParams<T> = () => Promise<T>;

export function useAsyncState<T>(func: UseAsyncStateParams<T>, defaultValue: T, replay?: number) {
	const [data, setData] = useState<T>(defaultValue);

	const handle = async (func: UseAsyncStateParams<T>) => {
		const out = await func();
		setData(out);
	};

	useEffect(() => {
		const load = () => {
			void func().then(setData);
		};

		load();
		const timer = replay ? setInterval(load, replay) : undefined;

		return () => {
			if (timer) clearInterval(timer);
		};
	}, [func, replay]);

	return {
		data: data,
		reload: () => handle(func),
	};
}
