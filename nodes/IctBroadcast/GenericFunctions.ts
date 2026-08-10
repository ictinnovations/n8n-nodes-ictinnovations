import type {
	IDataObject,
	IExecuteFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export interface Attachment {
	name: string;
	fileName: string;
	mimeType: string;
	buffer: Buffer;
}

/**
 * ICTBroadcast is not shaped like REST. Every call is a POST to /rest/<Method>
 * carrying multipart form fields, and the method name is the whole API surface.
 */
export async function ictBroadcastApiRequest(
	this: IExecuteFunctions,
	method: string,
	parameters: IDataObject = {},
	attachment?: Attachment,
): Promise<any> {
	const credentials = await this.getCredentials('ictBroadcastApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');

	const formData: IDataObject = {};
	for (const [key, value] of Object.entries(parameters)) {
		if (value === undefined || value === null || value === '') continue;
		formData[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
	}

	if (attachment) {
		formData[attachment.name] = {
			value: attachment.buffer,
			options: {
				filename: attachment.fileName,
				contentType: attachment.mimeType,
			},
		};
	}

	const options: IRequestOptions = {
		method: 'POST',
		uri: `${baseUrl}/rest/${method}`,
		formData,
		json: true,
		headers: {
			Accept: 'application/json',
		},
		rejectUnauthorized: !credentials.allowUnauthorizedCerts,
	};

	if (credentials.authentication === 'apiToken') {
		options.headers!.Authorization = `Bearer ${credentials.apiToken}`;
	} else {
		options.auth = {
			user: credentials.username as string,
			pass: credentials.password as string,
		};
	}

	try {
		const response = await this.helpers.request(options);
		// Some methods answer with a JSON string rather than a JSON body.
		if (typeof response === 'string') {
			try {
				return JSON.parse(response);
			} catch {
				return { result: response };
			}
		}
		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
