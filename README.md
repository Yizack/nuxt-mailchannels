![nuxt-mailchannels](https://github.com/user-attachments/assets/8d7d8822-915c-43cd-893e-4531b70817a5)

# Nuxt MailChannels

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]
[![Modules][modules-src]][modules-href]

Simple MailChannels Email Send API integration for Nuxt.

Leverages [`mailchannels-sdk`](https://github.com/Yizack/mailchannels) package, a MailChannels SDK for Node.js.

- [✨ Release Notes](CHANGELOG.md)
- [🏀 Online playground](https://stackblitz.com/github/yizack/nuxt-mailchannels?file=playground%2Fserver%27api%27send.ts)

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

- Send emails using [MailChannels Email Send API](https://docs.mailchannels.net/email-api/api-reference/send-an-email)
- Works on the edge
- Exposed server utils
- Email DKIM signing
- Default global settings
- Supports mustache templates
- Text and HTML content types

## Requirements

- Nuxt 3 or higher
- MailChannels account and Email API key

> [!WARNING]
> This module only works with a Nuxt server running as it uses utils for server API routes (`nuxt build`). This means that you cannot use this module with `nuxt generate`.

## Quick setup

1. Add `nuxt-mailchannels` dependency to your project

```sh
npx nuxi@latest module add mailchannels
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
  // Set the default settings for all your email transactions (optional)
  mailchannels: {
    bcc: { email: '', name: '' },
    cc: { email: '', name: '' },
    from: { email: '', name: '' },
    to: { email: '', name: '' },
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

# App config (optional)

# NUXT_MAILCHANNELS_BCC=
NUXT_MAILCHANNELS_BCC_EMAIL=
NUXT_MAILCHANNELS_BCC_NAME=

# NUXT_MAILCHANNELS_CC=
NUXT_MAILCHANNELS_CC_EMAIL=
NUXT_MAILCHANNELS_CC_NAME=

# NUXT_MAILCHANNELS_FROM=
NUXT_MAILCHANNELS_FROM_EMAIL=
NUXT_MAILCHANNELS_FROM_NAME=

# NUXT_MAILCHANNELS_TO=
NUXT_MAILCHANNELS_TO_EMAIL=
NUXT_MAILCHANNELS_TO_NAME=
```

> [!NOTE]
> Setting environment variables will override the settings in `nuxt.config.ts` file.

## Server utils

The following helpers are auto-imported in your `server/` directory.

```ts
// initialize a MailChannels instance
const mailchannels = useMailChannels(event)
```

### TypeScript signature
  
```ts
const useMailChannels: (event?: H3Event) => {
  send: (options: MailChannelsEmailOptions, dryRun?: boolean) => Promise<EmailsSendResponse>
}
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
  text: 'Your email content',
})
```

## Send method

The `send` method sends an email using the MailChannels API.

> [!IMPORTANT]
> If you set the `bcc`, `cc`, `from`, `to` properties in the `send` method, they will override the default global settings set in the `nuxt.config.ts` or `.env` file.

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

> [!TIP]
> Including a plain text version of your email ensures that all recipients can read your message, including those with email clients that lack HTML support.
>
> You can use the [`html-to-text`](https://www.npmjs.com/package/html-to-text) package to convert your HTML content to plain text.

### Response

The `send` method returns a promise that resolves to an object with the following properties.

| Property | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Indicates the success or failure of the email sending operation. |
| `data` | [`EmailsSendResponse["data"]`](https://github.com/Yizack/mailchannels/blob/main/src/types/emails/send.d.ts#L208-L233) or `null` | Read more in the [MailChannels Node.js SDK documentation](https://mailchannels.yizack.com/modules/emails#response) |
| `error` | [`ErrorResponse`](https://github.com/Yizack/mailchannels/blob/main/src/types/responses.d.ts#L1-L4) or `null` | Contains error information if the email sending operation fails. |


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
    text: 'Your email content',
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
    text: 'Your email content',
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
    text: 'Your email content',
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
    text: 'Your email content',
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
    text: 'Hello {{ world }}',
    mustaches: {
      world: 'World',
    },
  })

  return { success }
})
```

### Dry run

You can set the `dryRun` argument to test your email without sending it. It will return the fully rendered message in the `data.rendered` property of the response.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
    from: 'from@example.com',
    to: 'to@example.com',
    subject: 'Test',
    html: '<p>Test</p>',
    text: 'Test',
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
    text: 'Your email content',
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
pnpm dev:prepare

# Develop with the playground
pnpm dev

# Build the playground
pnpm dev:build

# Run ESLint
pnpm lint

# Run Vitest
pnpm test
pnpm test:watch

# Run typecheck
pnpm test:types

# Release new version
pnpm release
```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-mailchannels/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-mailchannels

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-mailchannels.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-mailchannels

[license-src]: https://img.shields.io/npm/l/nuxt-mailchannels.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com

[modules-src]: https://img.shields.io/badge/Modules-020420?logo=nuxt
[modules-href]: https://nuxt.com/modules/mailchannels
