export default interface MonitorSpec {
  getPath(): string
  getParam(): object
  getConverter(): (data) => any
}
