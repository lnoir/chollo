import { Injectable } from '@nestjs/common';
import { HtmlDocumentLoader } from '../../document-loaders/html-document.loader';
import { DocsService } from '../docs/docs.service';
import { TaskScheduled } from './entities/task-scheduled.entity';
import { TasksService } from './tasks.service';
import { JobAgent } from '../../agents/job.agent';
import { AllFilters, defaultFilterCriteria, defaultMatchFilterFn } from './filters';
import { MatchFilterFn } from './types';

jest.setTimeout(120000);

const agents = {
  'job': JobAgent
};

const confidenceMap = {
  'low': 0,
  'medium': 1,
  'high': 2
};

@Injectable()
export class Runner {

  constructor(
    private readonly docsService: DocsService,
    private readonly tasksService: TasksService
  ) {}

  retrievers = {
    web: {
      html: HtmlDocumentLoader,
    }
  }

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

  private async applySkill({task, docs, step, skillFn}) {
    const { agent, skill, params } = step;
    const modified = [];
    for (const doc of docs) {
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
      });
      modified.push(enriched);
    }
    return modified;
  }

  private async applyFilters({docs, filters}) {
    if (!filters?.length) return docs;
    return await filters.reduce(async (accp: Promise<any>, filter) => {
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

  async run(taskId: number) {
    const { task, retriever, location } = await this.prepareRun(taskId);
    const docs = await retriever.load();
    expect(docs).toHaveLength(24);
    
    let enriched: any;

    for (const step of task.steps) {
      const agent = agents[step.agent];
      if (!agent) throw new Error(`Invalid agent: '${agent}'`);
      const skillFn = agent[step.skill];
      if (!skillFn) throw new Error(`Invalid skill: '${skillFn}'`);

      enriched = await this.applySkill({
        task,
        docs: enriched || docs,
        step,
        skillFn
      });

      const { filters } = step;
      const filtered = await this.applyFilters({docs: enriched, filters});
      enriched = filtered;
    }
    return enriched;
  }

}
