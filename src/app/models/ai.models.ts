export interface RecommendationDTO {
    type: string;
    message: string;
    priority: string;
  }
  
  export interface UserAnalysisDTO {
    userId: number;
    userName: string;
    email: string;
    totalSpent: number;
    paymentCount: number;
    spendingCategory: string;
    loyaltyScore: number;
    recommendations: RecommendationDTO[];
  }
  
  export interface DashboardStatsDTO {
    totalUsers: number;
    totalRevenue: number;
    averageLoyaltyScore: number;
    spendingCategoryDistribution: { [category: string]: number };
    recommendationTypeDistribution: { [type: string]: number };
  }
  
  export interface RecommendationSummaryDTO {
    type: string;
    count: number;
    priority: string;
  }
  
  export interface AnalysisDashboardDTO {
    userAnalyses: UserAnalysisDTO[];
    stats: DashboardStatsDTO;
    recommendationSummary: RecommendationSummaryDTO[];
  }
  
  export interface UserFeaturesDTO {
    paymentCount: number;
    totalSpent: number;
    avgPayment: number;
    subscriptionCount: number;
    lastPaymentDate: string;
    preferredPaymentMethod: string;
    isYearlySubscriber: boolean;
  }
  
  export interface BehaviorAnalysisDTO {
    spendingCategory: string;
    loyaltyScore: number;
    paymentConsistency: string;
    preferredSubscriptionType: string;
  }
  
  export interface AnalysisResultDTO {
    userId: string;
    analysisDate: string;
    features: UserFeaturesDTO;
    behaviorAnalysis: BehaviorAnalysisDTO;
    recommendations: RecommendationDTO[];
  }
  