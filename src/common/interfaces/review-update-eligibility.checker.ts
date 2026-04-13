export interface ReviewUpdateEligibilityChecker {
  assertCanApplyAiResult(review_id: string): Promise<void>;
}
