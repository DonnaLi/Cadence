import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PUBLISH_QUEUE } from '../config';

export interface PublishJobData {
  postId: string;
}

/**
 * Runs in the worker process only. Milestone 5 replaces the body with the real
 * flow: load the post, call the mock platform, record the attempt, update status.
 */
@Processor(PUBLISH_QUEUE)
export class PublishProcessor extends WorkerHost {
  private readonly logger = new Logger(PublishProcessor.name);

  async process(job: Job<PublishJobData>): Promise<{ postId: string }> {
    this.logger.log(
      `Job ${job.id}: would publish post ${job.data.postId} (attempt ${job.attemptsMade + 1})`,
    );
    return { postId: job.data.postId };
  }
}
