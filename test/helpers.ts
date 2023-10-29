import { DocsService } from "src/lib/modules/docs/docs.service";
import { TasksService } from "src/lib/modules/tasks/tasks.service";

export const staticTestHost = 'http://127.0.0.1:7878';

type Services = {
  docsService: DocsService,
  tasksService?: TasksService,
  sourceLocation?: string,
  formatLocation?: string,
  map?: object[];
}

export const getStaticUrl = (path: string) => {
  return `${staticTestHost}${path}`;
}

export async function setupTestDocs(
  {docsService, sourceLocation, formatLocation, map}: Services
) {
  const now = Date.now();
  const source = await docsService.insertDocSource({
    name: `Test ${now}`, type: 'web', location: sourceLocation || 'http://testymctest.face'
  });
  const format = await docsService.insertDocFormat(source.id, {
    name: `List format ${now}`, type: 'html', location: formatLocation || '/list-page', agent: 'job'
  });
  const config = await docsService.insertDocConfig(format.id, {
    selector_type: 'element',
    selector: 'article',
    js: false,
    map: map && [
      { title: 'h2' },
      { content: '.main-content' }
    ]
  });
  return { source, format, config }
}