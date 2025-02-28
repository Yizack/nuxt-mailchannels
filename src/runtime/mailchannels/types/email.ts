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

export interface MailChannelsEmailPayload {
  attachments?: MailChannelsEmailAttachment[]
  content: MailChannelsEmailContent[]
  from: MailChannelsEmailRecipient
  headers?: Record<string, string>
  mailfrom?: MailChannelsEmailRecipient
  personalizations: MailChannelsEmailPersonalization[]
  reply_to?: MailChannelsEmailRecipient
  subject: string
  tracking_settings?: MailChannelsEmailTrackingSettings
}

export interface MailChannelsEmailOptionsBase {
  /**
   * An array of attachments to be sent with the email
   */
  attachments?: MailChannelsEmailAttachment[]
  /**
   * The BCC recipients of the email. Can be an array of email addresses or an array of objects with email and name properties or a single email address string or an object with email and name properties.
   * @example
   * [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' },
   * ]
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * ['email1@example.com', 'email2@example.com']
   * @example
   * 'email@example.com'
   */
  bcc?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string
  /**
   * The CC recipients of the email. Can be an array of email addresses or an array of objects with email and name properties or a single email address string or an object with email and name properties.
   * @example
   * [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' },
   * ]
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * ['email1@example.com', 'email2@example.com']
   * @example
   * 'email@example.com'
   */
  cc?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string
  /**
   * The sender of the email. Can be a string or an object with email and name properties.
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * 'email@example.com'
   */
  from?: MailChannelsEmailRecipient | string
  /**
   * The recipient of the email. Can be an array of email addresses or an array of objects with `email` and `name` properties or a single email address string or an object with `email` and `name` properties.
   * @example
   * [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' },
   * ]
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * ['email1@example.com', 'email2@example.com']
   * @example
   * 'email@example.com'
   */
  to?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string[] | string
  /**
   * A single `replyTo` recipient object, or a single email address.
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * 'email@example.com'
   */
  replyTo?: MailChannelsEmailRecipient | string
  /**
   * The subject of the email
   */
  subject: string
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

export type MailChannelsEmailOptions = MailChannelsEmailOptionsBase & (
  | {
    /**
     * The HTML content of the email
     * @example
     * '<p>Hello World</p>'
     */
    html: string
    /**
     * The plain text content of the email (optional when html is provided)
     * @example
     * 'Hello World'
     */
    text?: string
  }
  | {
    /**
     * The HTML content of the email (optional when text is provided)
     * @example
     * '<p>Hello World</p>'
     */
    html?: string
    /**
     * The plain text content of the email
     * @example
     * 'Hello World'
     */
    text: string
  }
)
