import { Injectable } from '@nestjs/common';
import { HtmlDocumentLoader } from '../../document-loaders/html-document.loader';
import { DocsService } from '../docs/docs.service';
import { TaskScheduled } from './entities/task-scheduled.entity';
import { TasksService } from './tasks.service';
import { JobAgent } from '../../agents/job.agent';
import { AllFilters } from './filters';
import { Job } from '../queue/entities/job.entity';

const agents = {
  'job': JobAgent
};

const confidenceMap = {
  'low': 0,
  'medium': 1,
  'high': 2
};

@Injectable()
export class RunnerFactory {

  constructor(
    private readonly docsService: DocsService,
    private readonly tasksService: TasksService
  ) {}

  getNewRunner(): Runner {
    return new Runner(this.docsService, this.tasksService);
  }
}

class Runner {

  retrievers = {
    web: {
      html: HtmlDocumentLoader,
    }
  }

  constructor(
    private readonly docsService: DocsService,
    private readonly tasksService: TasksService
  ) {}
  

  private getRetriever(task: TaskScheduled) {
    if (
      this.retrievers[task.source.type] && 
      this.retrievers[task.source.type][task.format.type]
    ) {
      return this.retrievers[task.source.type][task.format.type];
    }
    throw new Error(`No Retriever for ${task.source.type}/${task.format.type}`);
  }

  private async prepareRun(taskId: number) {
    const task = await this.tasksService.findOne<TaskScheduled>(
      TaskScheduled, taskId
    );
    const Retriever = this.getRetriever(task);
    const location = task.source.location + task.format.location;
    const retriever = new Retriever(location, task.format.config);
    return { retriever, location, task };
  }

  private async applySkill({task, docs, step, skillFn, job}) {
    const { agent, skill, params } = step;
    const modified = [];
    for (const doc of docs) {
      console.log('@doc', doc, '/@doc');
      const res = await skillFn({doc: doc.pageContent, params});
      const enriched = {
        ...doc,
        preview: {
          ...res
        }
      }
      await this.tasksService.insertTaskOutput({
        task: task.id,
        json: enriched,
        agent,
        skill,
        job
      });
      modified.push(enriched);
    }
    return modified;
  }

  private async applyFilters({docs, filters}) {
    if (!filters?.length) return docs;
    return await filters.reduce(async (accp: Promise<Record<string, any>>, filter) => {
      const acc = await accp;
      if (!filter?.name) return acc;
      const { name, criteria: filterCriteria } = filter;
      const filterFn = AllFilters[filter.name];
      if (!filterFn) {
        console.warn(`SKIPPED INVALID FILTER: '${name}'`);
        return docs;
      }
      return await filterFn({docs, filterCriteria});
    }, Promise.resolve(docs));
  }

  async run(job: Job): Promise<object[]> {
    const { task, retriever, location } = await this.prepareRun(job.task);
    const docs = await retriever.load();
    
    let enriched: object[];

    for (const step of task.steps) {
      try {
        const agent = agents[step.agent];
        if (!agent) throw new Error(`Invalid agent: '${agent}'`);
        const skillFn = agent[step.skill];
        if (!skillFn) throw new Error(`Invalid skill: '${skillFn}'`);

        enriched = await this.applySkill({
          task,
          docs: enriched || docs,
          step,
          skillFn,
          job: job.id
        });

        const { filters } = step;
        const filtered = await this.applyFilters({docs: enriched, filters});
        enriched = filtered;
      }
      catch(err) {
        // @TODO
        // Update relevant task record(s) and rethrow error
        throw err;
      }
    }
    return enriched;
  }

}
