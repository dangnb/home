export type ModuleType =
  | "TrendAnalysis"
  | "ContentGen"
  | "ImageGen"
  | "ComplianceCheck"
  | "Spintax"
  | "GrowthAnalysis";

export type PostStatus = "draft" | "review" | "approved" | "scheduled" | "published" | "blocked";

export type CopywritingFormula = "PAS" | "AIDA" | "FAB" | "Storytelling" | "Before-After-Bridge" | "Problem-Agitate-Solve";

export type MediaFormat = "SingleImage" | "Carousel" | "ShortVideo" | "Infographic";

export type MediaGenerationSpec = {
  recommended_format: MediaFormat;
  ai_image_prompt_en: string;
  overlay_text_vi: string;
  badge_label?: string;
  image_data_url?: string;
};

export type ComplianceRiskItem = {
  code: string;
  severity: "warning" | "high";
  message: string;
  match: string;
  suggestion?: string;
};

export type ComplianceCheckResult = {
  is_safe_for_facebook: boolean;
  detected_risks: ComplianceRiskItem[];
  predicted_engagement_score: number;
  auto_revised_content?: string;
};

export type StructuredPostOutput = {
  post_title_internal: string;
  copywriting_formula_used: string;
  hook_type: string;
  main_content: string;
  hashtags: string[];
  first_comment: string;
  media_generation: MediaGenerationSpec;
  compliance_check: ComplianceCheckResult;
};

export type ViralDNA = {
  text_on_image?: string;
  primary_color_palette?: string;
  thumb_stopping_factor: string;
  core_emotion: string;
  hook_type: string;
  customer_pain_point: string;
  why_it_went_viral: string;
};

export type CommentSentimentDeconstruction = {
  praises: string[];
  complaints: string[];
  purchase_questions: string[];
  unmet_needs: string[];
  recommended_content_angles: string[];
};

export type TrendDeconstructionResult = {
  viral_dna: ViralDNA;
  comment_sentiment: CommentSentimentDeconstruction;
  suggested_angles: Array<{
    title: string;
    hook: string;
    target_pain_point: string;
  }>;
};

export type ProductKnowledgeItem = {
  id: string;
  workspaceId: string;
  title: string;
  category: "usp" | "pricing" | "faq" | "feature" | "guarantee";
  contentText: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type BrandVoice = {
  id: string;
  workspaceId: string;
  name: string;
  systemPrompt: string;
  tone: string;
  targetAudience: string;
  preferredFormulas: string[];
  autoTuningHistory: Array<{
    date: string;
    reason: string;
    oldPrompt: string;
    newPrompt: string;
    accepted: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type WinningPostEmbedding = {
  id: string;
  workspaceId: string;
  pageId: string | null;
  postId: string;
  contentText: string;
  embeddingVector?: number[];
  performanceScore: number;
  formula: string;
  hookType: string;
  createdAt: string;
};

export type SpintaxVariation = {
  id: string;
  targetChannelOrPage: string;
  targetAudienceSegment: string;
  mainContent: string;
  firstComment: string;
  cosineSimilarityWithOriginal: number;
};

export type BestTimeToPostSpec = {
  contentType: "viral_entertainment" | "b2b_sales_knowledge";
  suggestedTimeSlot: string;
  optimalHourRange: string;
  recommendedDateTime: string;
  rationale: string;
};

export type GrowthPatternInsight = {
  formulaUsed: string;
  hookType: string;
  multiplierEffect: string;
  observation: string;
  actionableRecommendation: string;
};

export type GrowthReport = {
  id: string;
  analyzedPostCount: number;
  topWinnerTitles: string[];
  lowPerformerTitles: string[];
  patterns: GrowthPatternInsight[];
  suggestedBrandVoicePrompt: string;
  autoTuningRationale: string;
  createdAt: string;
};

export type TokenUsage = {
  id: string;
  workspaceId: string;
  moduleType: ModuleType;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  createdAt: string;
};

export type MarketingPost = {
  id: string;
  topic: string;
  title: string;
  formula: string;
  hookType: string;
  body: string;
  hashtags: string[];
  firstComment: string;
  artDirectionPrompt: string;
  mediaGeneration: MediaGenerationSpec;
  compliance: ComplianceCheckResult;
  status: PostStatus;
  scheduledAt: string | null;
  pageId: string | null;
  facebookPostId: string | null;
  metrics: { impressions: number; engagements: number; clicks: number; measuredAt: string } | null;
  spintaxVariations?: SpintaxVariation[];
  bestTimeRecommendation?: BestTimeToPostSpec;
  createdAt: string;
  updatedAt: string;
};

export type MarketingTrend = {
  id: string;
  title: string;
  keyword: string;
  source: string;
  summary: string;
  relevanceScore: number;
  clusterTopic?: string;
  discoveredAt: string;
};

export type SystemConfig = {
  aiProvider: "openai" | "anthropic" | "gemini" | "azure_openai" | "demo";
  openaiApiKey: string;
  openaiModel: string;
  anthropicApiKey: string;
  anthropicModel: string;
  geminiApiKey: string;
  geminiModel: string;
  azureOpenAiEndpoint: string;
  azureOpenAiKey: string;
  azureOpenAiDeployment: string;
  replicateApiKey: string;

  tier1Model: string;
  tier2Model: string;
  tier3ImageModel: string;

  facebookPageId: string;
  facebookPageAccessToken: string;
  facebookAppId: string;
  facebookAppSecret: string;

  qdrantUrl: string;
  qdrantApiKey: string;
  qdrantCollection: string;

  trendFeedUrls: string;
  trendKeywords: string;
};

