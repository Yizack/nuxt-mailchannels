![nuxt-mailchanneñs](https://github.com/user-attachments/assets/e166777a-8279-4167-946f-fbf8a0c76b16)

# Nuxt MailChannels

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Simple MailChannels Email API integration for Nuxt.

- [✨ Release Notes](CHANGELOG.md)
- [🏀 Online playground](https://stackblitz.com/github/yizack/nuxt-mailchannels?file=playground%2Fserver%27api%27send.t)

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Quick setup](#quick-setup)
- [Configuration](#configuration)
- [Server utils](#server-utils)
  - [TypeScript signature](#typescript-signature)
  - [Simple usage](#simple-usage)
- [Send method](#send-method)
  - [Arguments](#arguments)
  - [Options](#options)
  - [Response](#response)
- [Examples](#examples)
  - [Using object recipients (recommended)](#using-object-recipients-recommended)
  - [Using string recipients](#using-string-recipients)
  - [Array of recipients](#array-of-recipients)
  - [Mustache templates](#using-mustache-templates)
  - [Dry run](#dry-run)
  - [Name-address pairs](#name-address-pairs)

## Features

- Send emails using [MailChannels Email API](https://docs.mailchannels.net/email-api)
- Works on the edge
- Exposed server utils
- Email DKIM signing
- Default global settings
- Supports mustache templates

## Requirements

- Nuxt 3 or higher
- MailChannels account and Email API key

> [!WARNING]
> This module only works with a Nuxt server running as it uses utils for server API routes (`nuxt build`). This means that you cannot use this module with `nuxt generate`.

## Quick setup

1. Add `nuxt-mailchannels` dependency to your project

```sh
pnpm add nuxt-mailchannels -D
```

2. Add the module in your `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-mailchannels'
  ],
})
```

## Configuration

You can add the MailChannels **API key** and **DKIM** settings to the `runtimeConfig` property in `nuxt.config.ts` file.

If you want to use default global settings for all your email transactions, you can set it in the `mailchannels` app options property in your `nuxt.config.ts` file.

```ts
export default defineNuxtConfig({
  // Runtime config
  runtimeConfig: {
    mailchannels: {
      apiKey: '',
      dkim: {
        domain: '',
        privateKey: '',
        selector: '',
      },
    },
  },
  // Set the default settings for all your email transactions
  mailchannels: {
    bcc: { email: '',  name: '' },
    cc: { email: '', name: '' },
    from: { email: '', name: '' },
    to: { email: '', name: '' }
  },
})
```

> [!NOTE]
> `bcc`, `cc`, and `to` can be an object with `email` and `name` properties or a single email address string or an array of them.


Use the environment variables to set your API key, DKIM settings and default global settings.

```sh
# Runtime config
NUXT_MAILCHANNELS_API_KEY=

NUXT_MAILCHANNELS_DKIM_DOMAIN=
NUXT_MAILCHANNELS_DKIM_PRIVATE_KEY=
NUXT_MAILCHANNELS_DKIM_SELECTOR=

# App config (additional)
NUXT_MAILCHANNELS_BCC_EMAIL=
NUXT_MAILCHANNELS_BCC_NAME=

NUXT_MAILCHANNELS_CC_EMAIL=
NUXT_MAILCHANNELS_CC_NAME=

NUXT_MAILCHANNELS_FROM_EMAIL=
NUXT_MAILCHANNELS_FROM_NAME=

NUXT_MAILCHANNELS_TO_EMAIL=
NUXT_MAILCHANNELS_TO_NAME=
```

## Server utils

The following helpers are auto-imported in your `server/` directory.

```ts
// initialize a MailChannels instance
const mailchannels = useMailChannels(event)
```

### TypeScript signature
  
```ts
declare const useMailChannels: (event?: H3Event) => MailChannels;

MailChannels.send(options: MailChannelsEmailOptions, dryRun?: boolean): Promise<{
  success: boolean;
  payload: MailChannelsEmailPayload;
  data: string[] | undefined;
}>;
```


### Simple usage

```ts
const mailchannels = useMailChannels(event)
await mailchannels.send({
  from: {
    email: 'from@example.com',
    name: 'Example 2'
  },
  to: {
    email: 'to@example.com',
    name: 'Example 1'
  },
  subject: 'Your subject',
  html: '<p>Your email content</p>',
})
```

## Send method

The `send` method sends an email using the MailChannels API.

> [!IMPORTANT]
> If you set the `bcc`, `cc`, `from`, `to` properties in the `send` method, they will override the default global settings set in the `nuxt.config.ts` file.

### Arguments

| Argument | Type | Description | Required |
| --- | --- | --- | --- |
| `options` | [`Options`](#options) | The email options to send | ✅ |
| `dryRun` | `boolean` | When set to `true`, the message will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response. The default value is `false`. | ❌ |

### Options

Available options for the `send` method.

| Property | Description | Required |
| --- | --- | --- |
| `attachments` | An array of attachments to add to the email. Each attachment should be an object with `filename`, `content`, and `type` properties. | ❌ |
| `bcc` | The BCC recipients of the email. Can be an object with `email` and `name` properties or a single email address string or an array of them. | ❌ |
| `cc` | The CC recipients of the email. Can be an object with `email` and `name` properties or a single email address string or an array of them. | ❌ |
| `from` | The sender of the email. Can be a string or an object with `email` and `name` properties. Required when the default global sender is not set. | 🟡 |
| `to` | The recipient of the email. Can be an object with `email` and `name` properties or a single email address string or an array of them. Required when the default global recipient is not set. | 🟡 |
| `replyTo` | The email address to reply to. Can be a string or an object with `email` and `name` properties. | ❌ |
| `subject` | The subject of the email. | ✅ |
| `html` | The HTML content of the email. Required if `text` is not set. | 🟡 |
| `text` | The plain text content of the email. Required if `html` is not set. | 🟡 |
| `mustaches` | Data to be used if the email is a mustache template, key-value pairs of variables to set for template rendering. Keys must be strings. | ❌ |

### Response

The `send` method returns a promise that resolves to an object with the following properties.

| Property | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Indicates the success or failure of the email sending operation. |
| `payload` | `object` | The payload sent to the MailChannels Email API. DKIM data (`dkim_domain`, `dkim_private_key`, `dkim_selector`) is redacted in production for security reasons. |
| `data` | `string[]` or `undefined` | The fully rendered message if the `dryRun` argument is set to `true`. |


## Examples

Use the `send` method inside your API routes to send emails.

The recipient parameters can be either an email address string or an object with `email` and `name` properties.

### Using object recipients (recommended)

This is the best way to add names to the recipients.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const { success } = await mailchannels.send({
    from: {
      email: 'from@example.com',
      name: 'Example 2'
    },
    to: {
      email: 'to@example.com',
      name: 'Example 1'
    },
    subject: 'Your subject',
    html: '<p>Your email content</p>',
  })
  return { success }
})
```


### Using string recipients

This is the simplest way to send an email.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const { success } = await mailchannels.send({
    from: 'from@example.com',
    to: 'to@example.com',
    subject: 'Your subject',
    html: '<p>Your email content</p>',
  })
  return { success }
})
```

### Array of recipients

You can also send an email to multiple recipients.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const { success } = await mailchannels.send({
    from: {
      email: 'from@example.com',
      name: 'Example 3'
    },
    to: [
      {
        email: 'to1@example.com',
        name: 'Example 1'
      },
      {
        email: 'to2@example.com',
        name: 'Example 2'
      }
    ],
    subject: 'Your subject',
    html: '<p>Your email content</p>',
  })
  return { success }
})
```

or

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const { success } = await mailchannels.send({
    from: 'from@example.com',
    to: ['to1@example.com', 'to2@example.com'],
    subject: 'Your subject',
    html: '<p>Your email content</p>',
  })
  return { success }
})
```

### Using mustache templates

You can use the `mustaches` property to render mustache templates.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const { success } = await mailchannels.send({
    from: 'from@example.com',
    to: 'to@example.com',
    subject: 'Mustaches test',
    html: '<p>Hello {{ world }}</p>',
    mustaches: {
      world: 'World',
    },
  })

  return { success }
})
```

### Dry run

You can set the `dryRun` argument to test your email without sending it. It will return the fully rendered message in the `data` property of the response.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
    from: 'from@example.com',
    to: 'to@example.com',
    subject: 'Test',
    html: '<p>Test</p>',
  }, true) // <-- `true` = dryRun enabled

  return response
})
```

### Name-address pairs

You can use name-address pairs string format.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const { success } = await mailchannels.send({
    from: 'Sender Name <sender@example.com>',
    to: 'Recipient Name <recipient@example.com>',
    subject: 'Your subject',
    html: '<p>Your email content</p>',
  })

  return { success }
})
```

## Contribution

<details>
  <summary>Local development</summary>
  
```sh
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Run typecheck
npm run test:types

# Release new version
npm run release
```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-mailchannels/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-mailchannels

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-mailchannels.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-mailchannels

[license-src]: https://img.shields.io/npm/l/nuxt-mailchannels.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com

[modules-src]: https://img.shields.io/badge/Modules-020420?logo=nuxt.js
[modules-href]: https://nuxt.com/modules/mailchannels
