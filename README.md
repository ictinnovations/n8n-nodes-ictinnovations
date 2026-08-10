# n8n-nodes-ictinnovations

n8n community nodes for the [ICT Innovations](https://ictinnovations.com) telephony stack. Send faxes, place calls, manage contacts and run outbound campaigns straight from an n8n workflow.

The package ships three nodes because the products behind them speak two different protocols:

| Node | Talks to | Protocol |
|------|----------|----------|
| **ICTCore** | [ICTFax](https://ictfax.com), [ICTPBX](https://ictpbx.com), [open source ICTDialer](https://github.com/ictinnovations/ictdialer) | ICTCore REST API |
| **ICTBroadcast** | [ICTBroadcast](https://ictbroadcast.com) | RPC over HTTP POST |
| **ICTContact** | [ICTContact](https://ictcontact.com), [ICTDialer.com](https://ictdialer.com) | RPC over HTTP POST |

ICTFax, ICTPBX and the open source ICTDialer all sit on top of [ICTCore](https://github.com/ictinnovations/ictcore), so one node and one credential covers all three.

> **Which ICTDialer?** Two different products share the name. The open source [ICTDialer](https://github.com/ictinnovations/ictdialer) is built on FreeSWITCH and ICTCore, so it uses the **ICTCore** node. [ICTDialer.com](https://ictdialer.com) is the hosted edition of [ICTContact](https://ictcontact.com) and is Asterisk based, so it uses the **ICTContact** node.

ICTBroadcast and ICTContact expose the same method names on the same paths, so the two nodes offer the same operations and differ only in branding and which credential they use.

## Install

In n8n, go to **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-ictinnovations
```

Self-hosted n8n only. n8n Cloud doesn't allow community nodes that make arbitrary HTTP calls.

Manual install:

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-ictinnovations
```

Restart n8n afterwards.

## Credentials

### ICTCore API

| Field | Value |
|-------|-------|
| Base URL | Your server without the `/api` suffix, for example `https://pbx.example.com` |
| Authentication | Basic (username and password) or API Token |
| Allow Unauthorized Certs | Turn this on if your box still runs a self-signed certificate |

The same credential works for ICTFax, ICTPBX and the open source ICTDialer. Point the base URL at whichever server you want to drive.

### ICTBroadcast API

| Field | Value |
|-------|-------|
| Base URL | Your server without the `/rest` suffix |
| Authentication | API Token (default) or Basic |
| API Token | Found in ICTBroadcast under **My Account → API Key** |

## What the ICTCore node does

**Fax**
- **Send** runs the whole ICTCore fax sequence in one step: creates the contact, creates the document, uploads your binary file, builds a sendfax program, creates the transmission and fires it. Optionally waits for the result.
- Get Many, Download

**Call**
- Originate, Get Many

**Contact**
- Create, Get, Get Many, Update, Delete

**Group**
- Create, Get Many, Delete, Add Contact, Get Contacts

**Campaign**
- Create, Get, Get Many, Start, Stop, Delete

**Transmission**
- Get, Get Many, Send, Retry, Get Status, Get Result

**Extension** (ICTPBX)
- Create, Get Many, Delete, Get Next Available

**Report**
- Get CDR, Get Statistics

### About the fax Send operation

Sending a fax through the raw ICTCore API takes six calls in a fixed order. Getting one of them wrong leaves orphaned records on the server, which is annoying to clean up. The **Send** operation does the whole sequence for you:

```
POST /contacts                        create the recipient
POST /messages/documents              register the document
PUT  /messages/documents/{id}/media   upload the file bytes
POST /programs/sendfax                build the program
POST /transmissions                   bind contact to program
POST /transmissions/{id}/send         send it
```

Feed it a binary property from a previous node (a Read Binary File, an HTTP Request, an email attachment) and a destination number, and you're done.

### There are no webhooks

ICTCore has no outbound webhook or event stream, so nothing can push a delivery result back into n8n. If you need to know whether a fax landed, either switch on **Wait for Result** in the Send operation, or add a Schedule Trigger that polls **Transmission → Get Status**. The node's wait helper polls until the status leaves `pending`, `processing`, `scheduled` or `ready`.

### ICTContact API

Same fields as the ICTBroadcast credential. Point the base URL at your ICTContact server, or at your ICTDialer.com account, without the `/rest` suffix.

## What the ICTBroadcast and ICTContact nodes do

Both nodes expose the same operations.

**Campaign**
- Start, Stop, Get Status, Get Summary, Get Result, Filter, Create Contact, Import Contacts (upload a CSV as binary data)

**Contact**
- Create, Delete

**User**
- Create, Update, Get, Delete, List Roles

ICTBroadcast isn't shaped like REST. Every call is a POST to `/rest/<Method_Name>` carrying multipart form fields, so the node maps each operation to the matching method name rather than to a URL path.

## Example: fax every invoice PDF that lands in a folder

```
Local File Trigger  →  Read Binary File  →  ICTCore (Fax: Send)  →  Slack
```

Set **Wait for Result** on the ICTCore node and the Slack message can report whether the fax actually went through.

## Example: add a form submission to a dialer campaign

```
Webhook  →  ICTCore (Contact: Create)  →  ICTCore (Group: Add Contact)
```

Then run **Campaign → Start** on a schedule, or start it by hand.

## Compatibility

Tested against n8n 1.x. Needs Node.js 20.15 or newer, which is what n8n itself requires.

## Links

- [ICTCore on GitHub](https://github.com/ictinnovations/ictcore)
- [ICTPBX REST API reference](https://ictpbx.com/ictpbx-rest-api/)
- [ICTBroadcast REST API guide](https://www.ictbroadcast.com/using-rest-api-integrate-ictbroadcast-third-party-application-autodialer/)
- [n8n community nodes docs](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
