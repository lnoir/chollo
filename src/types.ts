export type JobSkillData = {
  job: string;
  skills: string;
}

export enum JobStatus {
  QUEUED = 'queued',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  DELETED = 'deleted',
}