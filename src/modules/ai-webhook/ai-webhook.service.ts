import {
  ConflictException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import type { ReviewUpdateEligibilityChecker } from '../../common/interfaces/review-update-eligibility.checker';
import { REVIEW_UPDATE_ELIGIBILITY_CHECKER } from '../../common/tokens';
import { ReviewsPrismaRepository } from '../reviews/reviews.repository';
import type { RunpodAnalysisWebhookDto } from './dto/runpod-analysis-webhook.dto';

@Injectable()
export class AiWebhookService {
  constructor(
    private readonly config: ConfigService,
    private readonly reviewsRepository: ReviewsPrismaRepository,
    @Inject(REVIEW_UPDATE_ELIGIBILITY_CHECKER)
    private readonly reviewEligibility: ReviewUpdateEligibilityChecker,
  ) {}

  private assertSignature(dto: RunpodAnalysisWebhookDto) {
    const secret = this.config.get<string>('RUNPOD_WEBHOOK_SECRET');
    if (!secret) {
      return;
    }
    if (!dto.signature || dto.signature !== secret) {
      throw new UnprocessableEntityException('invalid_webhook_signature');
    }
  }

  async handleRunpodAnalysis(dto: RunpodAnalysisWebhookDto) {
    this.assertSignature(dto);
    if (dto.value_score === undefined && dto.ai_analysis === undefined) {
      throw new UnprocessableEntityException(
        'value_score_or_ai_analysis_required',
      );
    }

    await this.reviewEligibility.assertCanApplyAiResult(dto.review_id);

    const payload: Prisma.InputJsonValue = {
      external_job_id: dto.external_job_id,
      value_score: dto.value_score ?? null,
      ai_analysis: (dto.ai_analysis ?? null) as Prisma.InputJsonValue,
    };

    try {
      await this.reviewsRepository.applyAiWebhookResult({
        review_id: dto.review_id,
        external_job_id: dto.external_job_id,
        callback_status: 'received',
        payload,
        value_score: dto.value_score,
        ai_analysis: dto.ai_analysis as Prisma.InputJsonValue | undefined,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('duplicate_external_job_id');
      }
      throw e;
    }

    return { ok: true };
  }
}
