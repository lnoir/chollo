import * as StaticServer  from 'static-server';

export const createStaticServer = (port = 7878) => {
  const server = new StaticServer({
    rootPath: './test/static/pages',
    name: 'test-server',
    host: '127.0.0.1',
    cors: '*',
    port,
    templates: {
      index: 'index.html',
      notFound: 'index.html'
    }
  });

  return server;
}

export const runServer = (server) => {
  server.start(() => {
    console.log(`[Test] static server running...`);
  });
}