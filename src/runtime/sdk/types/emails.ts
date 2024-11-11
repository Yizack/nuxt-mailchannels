export interface MailChannelsEmailRecipient {
  /**
   * The email address of the recipient
   */
  email: string
  /**
   * The name of the recipient
   */
  name?: string
}

export interface MailChannelsEmailContent {
  template_type?: 'mustache'
  type: 'text/html' | 'text/plain'
  value: string
}

export interface MailChannelsEmailAttachment {
  /**
   * The attachment data, encoded in base64
   */
  content: string
  /**
   * The name of the attachment file
   */
  filename: string
  /**
   * The MIME type of the attachment
   */
  type: string
}

export interface MailChannelsEmailPersonalization {
  bcc?: MailChannelsEmailRecipient[]
  cc?: MailChannelsEmailRecipient[]
  dkim_domain?: string
  dkim_private_key?: string
  dkim_selector?: string
  dynamic_template_data?: Record<string, unknown>
  from?: MailChannelsEmailRecipient
  headers?: Record<string, string>
  reply_to?: MailChannelsEmailRecipient
  subject?: string
  to: MailChannelsEmailRecipient[]
}

export interface MailChannelsEmailTrackingSettings {
  click_tracking?: boolean
  open_tracking?: boolean
}

export interface MailChannelsEmailSend {
  attachments?: MailChannelsEmailAttachment[]
  content: MailChannelsEmailContent[]
  from: MailChannelsEmailRecipient
  headers?: Record<string, string>
  mailfrom?: MailChannelsEmailRecipient
  personalizations: MailChannelsEmailPersonalization[]
  reply_to?: MailChannelsEmailRecipient
  subject?: string
  tracking_settings?: MailChannelsEmailTrackingSettings
}

export interface MailChannelsEmailOptions {
  /**
   * An array of attachments to be sent with the email
   */
  attachments?: MailChannelsEmailAttachment[]
  /**
   * An array of `bcc` recipient objects, a single recipient object, or a single email address.
   * @example
   * bcc: [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' },
   * ]
   * @example
   * bcc: { email: 'email@example.com', name: 'Example' }
   * @example
   * bcc: 'email@example.com'
   */
  bcc?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string
  /**
   * An array of `cc` recipient objects, a single recipient object, or a single email address.
   * @example
   * cc: [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' },
   * ]
   * @example
   * cc: { email: 'email@example.com', name: 'Example' }
   * @example
   * cc: 'email@example.com'
   */
  cc?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string
  /**
   * An array of `from` recipient objects, a single recipient object, or a single email address.
   * @example
   * from: [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' },
   * ]
   * @example
   * from: { email: 'email@example.com', name: 'Example' }
   * @example
   * from: 'email@example.com'
   */
  from: MailChannelsEmailRecipient | string
  /**
   * An array of `to` recipient objects, a single recipient object, or a single email address.
   * @example
   * to: [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' },
   * ]
   * @example
   * to: { email: 'email@example.com', name: 'Example' }
   * @example
   * to: 'email@example.com'
   */
  to: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string
  /**
   * An array of `reply_to` recipient objects, a single recipient object, or a single email address.
   * @example
   * reply_to: [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' },
   * ]
   * @example
   * reply_to: { email: 'email@example.com', name: 'Example' }
   * @example
   * reply_to: 'email@example.com'
   */
  reply_to?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string
  /**
   * The subject of the email
   */
  subject: string
  /**
   * The content of the email
   */
  html: string
  /**
   * Data to be used if the email is a mustache template, key-value pairs of variables to set for template rendering. Keys must be strings
   *
   * the values can be one of the following types:
   * - string
   * - number
   * - boolean
   * - list, whose values are all of permitted types
   * - map, whose keys must be strings, and whose values are all of permitted types
   */
  mustaches?: Record<string, unknown>
}
