import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class IctCoreApi implements ICredentialType {
	name = 'ictCoreApi';

	displayName = 'ICTCore API';

	documentationUrl = 'https://ictpbx.com/ictpbx-rest-api/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://pbx.example.com',
			required: true,
			description:
				'Your server address without the /api suffix. The same credential works for ICTFax, ICTPBX and the open source ICTDialer, since all three run on ICTCore. For ICTDialer.com, use the ICTContact credential instead.',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'options',
			options: [
				{
					name: 'Username and Password',
					value: 'basic',
				},
				{
					name: 'Bearer Token',
					value: 'apiToken',
				},
			],
			default: 'basic',
			description:
				'ICTCore accepts HTTP Basic on every endpoint. Pick Bearer Token if you already hold a JWT from POST /authenticate.',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			placeholder: 'admin@ictcore.org',
			displayOptions: {
				show: {
					authentication: ['basic'],
				},
			},
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					authentication: ['basic'],
				},
			},
		},
		{
			displayName: 'Bearer Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					authentication: ['apiToken'],
				},
			},
			description: 'The token returned by POST /authenticate',
		},
		{
			displayName: 'Ignore SSL Issues',
			name: 'allowUnauthorizedCerts',
			type: 'boolean',
			default: false,
			description:
				'Whether to accept a self-signed certificate. Common on an on-premise PBX that was never given a public certificate.',
		},
	];
}
