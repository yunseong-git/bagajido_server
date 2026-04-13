import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiWebhookService } from './ai-webhook.service';
import { RunpodAnalysisWebhookDto } from './dto/runpod-analysis-webhook.dto';

@ApiTags('webhooks')
@Controller('webhooks')
export class AiWebhookController {
  constructor(private readonly aiWebhookService: AiWebhookService) {}

  @Post('runpod/analysis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'RunPod AI 분석 결과 수신' })
  handleRunpod(@Body() body: RunpodAnalysisWebhookDto) {
    return this.aiWebhookService.handleRunpodAnalysis(body);
  }
}
