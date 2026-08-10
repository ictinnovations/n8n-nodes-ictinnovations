import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class IctContactApi implements ICredentialType {
	name = 'ictContactApi';

	displayName = 'ICTContact API';

	documentationUrl =
		'https://www.ictcontact.com/using-rest-based-api-to-integrate-ictcontact-with-third-party-application-and-autodialer-automation/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://contact.example.com',
			required: true,
			description:
				'Your ICTContact address without the /rest suffix. ICTDialer.com is the hosted edition of ICTContact, so use this credential for it too.',
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
			description: 'Find this in ICTContact under My Account, API Key',
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
