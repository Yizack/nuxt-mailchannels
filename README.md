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
- [Send method](#send-method)
  - [Arguments](#arguments)
  - [Options](#options)
- [Examples](#examples)
  - [Using object recipients (recommended)](#using-object-recipients-recommended)
  - [Using string recipients](#using-string-recipients)
  - [Array of recipients](#array-of-recipients)
  - [Using mustache templates](#using-mustache-templates)
  - [Dry run](#dry-run)

## Features

- Send emails using [MailChannels Email API](https://docs.mailchannels.net/email-api)
- Works on the edge
- Exposed server utils
- Email DKIM signing
- Default global sender email and name
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

If you want to use a default global sender email and name for all your email transactions, you can set it in the `mailchannels` app options property in your `nuxt.config.ts` file.

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
  // Set the default sender email and name for all your email transactions
  mailchannels: {
    from: {
      email: 'custom@example.com',
      name: 'Custom Name',
    },
  },
})
```

Use the environment variables to set your API key, DKIM settings and default global sender.

```sh
# .env
NUXT_MAILCHANNELS_API_KEY=

NUXT_MAILCHANNELS_DKIM_DOMAIN=
NUXT_MAILCHANNELS_DKIM_PRIVATE_KEY=
NUXT_MAILCHANNELS_DKIM_SELECTOR=

NUXT_MAILCHANNELS_FROM_EMAIL=
NUXT_MAILCHANNELS_FROM_NAME=
```

## Server utils

The following helpers are auto-imported in your `server/` directory.

```ts
// initialize a MailChannels instance
const mailchannels = useMailChannels(event)
```

## Send method

The `send` method sends an email using the MailChannels API. It returns a promise that resolves to a boolean indicating the success or failure of the email sending operation.

> [!IMPORTANT]
> If you set the `from` property in the `send` method, it will override the default global sender email and name set in the `nuxt.config.ts` file.

### Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `options` | [`MailChannelsEmailOptions`](#send-options) | The email options to send |
| `dryRun` | `boolean` | When set to true, the message will not be sent. Instead, the fully rendered message will be printed to the console. This can be useful for testing. Defaults to `false` |

### Options

Available options for the `send` method.

| Property | Description |
| --- | --- |
| `attachments` | An array of attachments to add to the email. Each attachment should be an object with `filename`, `content`, and `type` properties. |
| `bcc` | The BCC recipients of the email. Can be an array of email addresses or an array of objects with `email` and `name` properties or a single email address string or an object with `email` and `name` properties. |
| `cc` | The CC recipients of the email. Can be an array of email addresses or an array of objects with `email` and `name` properties or a single email address string or an object with `email` and `name` properties. |
| `to` | The recipient of the email. Can be an array of email addresses or an array of objects with `email` and `name` properties or a single email address string or an object with `email` and `name` properties. |
| `from` | The sender of the email. Can be a string or an object with `email` and `name` properties. |
| `replyTo` | The email address to reply to. Can be a string or an object with `email` and `name` properties. |
| `subject` | The subject of the email. |
| `html` | The content of the email. |
| `mustaches` | Data to be used if the email is a mustache template, key-value pairs of variables to set for template rendering. Keys must be strings. |


## Examples

Use the `send` method inside your API routes to send emails.

The recipient parameters can be either an email address string or an object with `email` and `name` properties.

### Using object recipients (recommended)

This is the best way to add names to the recipients.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
    to: {
      email: 'to@example.com',
      name: 'Example 1'
    },
    from: {
      email: 'from@example.com',
      name: 'Example 2'
    },
    subject: 'Your subject',
    html: '<p>Your email content</p>',
  })
  return { response }
})
```


### Using string recipients

This is the simplest way to send an email.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
    to: 'to@example.com',
    from: 'from@example.com',
    subject: 'Your subject',
    html: '<p>Your email content</p>',
  })
  return { response }
})
```

### Array of recipients

You can also send an email to multiple recipients.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
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
    from: {
      email: 'from@example.com',
      name: 'Example 3'
    },
    subject: 'Your subject',
    html: '<p>Your email content</p>',
  })
  return { response }
})
```

or

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
    to: ['to1@example.com', 'to2@example.com'],
    from: 'from@example.com',
    subject: 'Your subject',
    html: '<p>Your email content</p>',
  })
  return { response }
})
```

### Using mustache templates

You can use the `mustaches` property to render mustache templates.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
    to: 'to@example.com',
    from: 'from@example.com',
    subject: 'Mustaches test',
    html: '<p>Hello {{ world }}</p>',
    mustaches: {
      world: 'World',
    },
  })

  return { response }
})
```

### Dry run

You can set the `dryRun` argument to test your email without sending it. It will print the fully rendered message to the console.

```ts
export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
    to: 'to@example.com',
    from: 'from@example.com',
    subject: 'Test',
    html: '<p>Test</p>',
  }, true) // <-- `true` = dryRun enabled

  return { response }
})
```

# Development

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
