export function formDataToObject(formData: FormData) {
	function convert(inital: object, pattern: string, value: any) {
		const parts = pattern.trim().split('.');
		const result: Record<string, any> = inital;
		let current = result;
		function getType(v: any) {
			return Number.isFinite(Number(v)) ? 'Array' : 'Object';
		}
		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			// eslint-disable-next-line no-prototype-builtins
			if (current.hasOwnProperty(part)) {
				current = current[part];
				continue;
			}
			if (getType(parts[i + 1]) === 'Array') {
				current[part] = [];
			} else {
				current[part] = {};
			}
			current = current[part];
		}
		const lastPart = parts[parts.length - 1];
		if (getType(lastPart) === 'Array') {
			current.push(value);
		} else {
			current[lastPart] = value;
		}
		return result;
	}
	let body = {};
	formData.forEach((v, k) => {
		body = convert(body, k, v);
	});
	return body;
}
export function objectToFormdata(obj: object): FormData {
	function objectToEntries(name: string, value: any, result: Array<any>): any {
		if (!Array.isArray(value) && typeof value !== 'object') {
			result.push([name, value]);
			return;
		}

		Object.keys(value).forEach((key) => {
			objectToEntries((name != '' ? name + '.' : '') + key, value[key], result);
		});
	}
	const enteries: any = [];
	const result = new FormData();
	objectToEntries('', obj, enteries);
	console.log(enteries);
	enteries.forEach((entry: any) => {
		result.append(entry[0], entry[1]);
	});
	return result;
}