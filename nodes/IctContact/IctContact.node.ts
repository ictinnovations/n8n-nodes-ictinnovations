import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { IctBroadcast } from '../IctBroadcast/IctBroadcast.node';

// ICTContact answers the same RPC method names on the same /rest path as
// ICTBroadcast; only the PHP namespace behind it differs. Probing both demo
// servers on 2026-08-10 found no divergence, so the operation set is shared
// rather than copied, and this node only rebrands it and swaps the credential.
const shared = new IctBroadcast();

export class IctContact implements INodeType {
	description: INodeTypeDescription = {
		...shared.description,
		displayName: 'ICTContact',
		name: 'ictContact',
		icon: { light: 'file:ictcontact.svg', dark: 'file:ictcontact.dark.svg' },
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Run ICTContact campaigns, users and contacts from a workflow',
		defaults: {
			name: 'ICTContact',
		},
		usableAsTool: true,
		credentials: [
			{
				name: 'ictContactApi',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await shared.execute.call(this);
	}
}
