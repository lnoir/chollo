export default () => ({
  queueCheckIntervalSeconds: process.env.CHOLLO_QUEUE_CHECK_INTERVAL_SECONDS,
  mainPort: process.env.CHOLLO_MAIN_PORT,
  queuePort: process.env.CHOLLO_QUEUE_PORT,
});