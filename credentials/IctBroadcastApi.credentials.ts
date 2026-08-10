import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class IctBroadcastApi implements ICredentialType {
	name = 'ictBroadcastApi';

	displayName = 'ICTBroadcast API';

	documentationUrl =
		'https://www.ictbroadcast.com/using-rest-api-integrate-ictbroadcast-third-party-application-autodialer/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://dialer.example.com',
			required: true,
			description: 'Your ICTBroadcast address without the /rest suffix',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'options',
			options: [
				{
					name: 'API Key',
					value: 'apiToken',
				},
				{
					name: 'Username and Password',
					value: 'basic',
				},
			],
			default: 'apiToken',
		},
		{
			displayName: 'API Key',
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
			description: 'Find this in ICTBroadcast under My Account, API Key',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
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
			displayName: 'Ignore SSL Issues',
			name: 'allowUnauthorizedCerts',
			type: 'boolean',
			default: false,
			description: 'Whether to accept a self-signed certificate',
		},
	];
}
