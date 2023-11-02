export default () => ({
  service: process.env.CHOLLO_SERVICES,
  mainPort: process.env.CHOLLOR_MAIN_PORT,
  queuePort: process.env.CHOLLO_QUEUE_PORT,
});