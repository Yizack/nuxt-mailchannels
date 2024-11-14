export class ModuleLogger {
  private moduleText: string
  constructor(private readonly name: string, private readonly method: string) {
    this.moduleText = `[MailChannels] [${name}.${method}]`
  }

  info(...message: unknown[]) {
    console.info(this.moduleText, ...message)
  }

  error(...message: unknown[]) {
    console.error(this.moduleText, ...message)
  }
}
