import { Injectable } from '@nestjs/common';
// import { HuggingFaceTransformersEmbeddings } from "langchain/embeddings/hf_transformers";
import { Ollama } from "langchain/llms/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } from 'langchain/prompts';
import { HtmlDocumentLoader, HtmlDocumentOptions } from './lib/document-loaders/html-document.loader';

import { ConversationChain, LLMChain, SequentialChain, TransformChain } from 'langchain/chains';
import { runJobSkillMatchingAgent } from './lib/agents/job.agent';

const llm = new Ollama({
  model: 'mistral-openorca:latest',
  temperature: 0.9,
});

type DocumentLoaderOptions = HtmlDocumentOptions & {
  keywords?: string[];
}

@Injectable()
export class AppService {

  controller: AbortController;

  constructor() {
    this.controller = new AbortController();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async testRun() {

    const result = await llm.predict(`Tell me something interesting about bees, in 3 sentences.`);
  
    return result;
  }
  
  async embeddy(url: string, options: DocumentLoaderOptions) {
    const loader = new HtmlDocumentLoader(url, options);
    const docs = await loader.load();
    const { keywords } = options;

    /*const vectoreStore = await HNSWLib.fromDocuments(
      docs,
     new HuggingFaceTransformersEmbeddings()
    );
  
    const retrievedDocs = await vectoreStore.similaritySearch(
      keywords.join(',')
    );*/
  
    //return retrievedDocs;
    return docs
  }

  async basicChain({job, skills}) {
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You're a job filter that evaluates a job against a set of skills. Output 'true' if the job includes the skills, or 'false' if it doesn't. Only output 'true' or 'false', and nothing else.`],
      ['human', 'These are the skills: {skills}. This is the job:\n{job}']
    ]);
    const promptChain = new LLMChain({llm, prompt});
    const result = await promptChain.call({
      prompt,
      job,
      skills,
      signal: this.controller.signal,
      verbose: false
    },
    // Don't need this now, but this is how we stream
    /*
    [
      {
        handleLLMNewToken(token: string) {
          process.stdout.write(token);
        }
      }
    ]*/);
    return result?.text?.trim().toLowerCase().includes('true') ? true : false;
  }

  async sequentialChain({job, skills}) {
    return await runJobSkillMatchingAgent({job, skills});
  }

  async abort() {
    this.controller.abort();
  }
}
