// Error for user not existing
export class ExpandWithAIUsageLimitReached extends Error {
  constructor(
    message: string = 'User has reached the limit of "Expand with AI" feature free usage',
  ) {
    super(message);
    this.name = "ExpandWithAIUsageLimitReached";
  }
}
