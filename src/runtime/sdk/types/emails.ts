export interface MailChannelsEmailRecipient {
  email: string
  name?: string
}

export interface MailChannelsEmailContent {
  template_type?: 'mustache'
  type: 'text/html' | 'text/plain'
  value: string
}

export interface MailChannelsEmailAttachment {
  content: string
  filename: string
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
  attachments?: MailChannelsEmailAttachment[]
  bcc?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string
  cc?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string
  from: MailChannelsEmailRecipient | string
  to: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string
  reply_to?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string
  subject: string
  html: string
  mustaches?: Record<string, unknown>
}
