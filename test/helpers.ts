import { DocsService } from "../src/lib/modules/docs/docs.service";
import { TasksService } from "../src/lib/modules/tasks/tasks.service";
import { DocSource } from '../src/lib/modules/docs/entities/doc-source.entity';
import { DocFormat } from '../src/lib/modules/docs/entities/doc-format.entity';
import { DocConfig } from '../src/lib/modules/docs/entities/doc-config.entity';
import { Doc } from '../src/lib/modules/docs/entities/doc.entity';
import { TaskScheduled } from '../src/lib/modules/tasks/entities/task-scheduled.entity';
import { TaskStep } from '../src/lib/modules/tasks/entities/task-step.entity';
import { TaskActive } from '../src/lib/modules/tasks/entities/task-active.entity';
import { TaskLogged } from '../src/lib/modules/tasks/entities/task-logged.entity';
import { TaskOutput } from '../src/lib/modules/tasks/entities/task-output.entity';

export const mainEntities = [
  DocSource, DocFormat, DocConfig, Doc, TaskScheduled, TaskStep, TaskActive, TaskLogged, TaskOutput
];

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
  const format = await docsService.insertDocFormat({
    name: `List format ${now}`,
    type: 'html',
    location: formatLocation || '/list-page',
    agent: 'job',
    source: source.id
  });
  const config = await docsService.insertDocConfig({
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