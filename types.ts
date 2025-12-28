
export interface HotelContext {
  targetProfitability: number; // Percentage
  timeframe: number; // Months
  city: string;
  currentRevPAR: number;
  currentADR: number;
  currentOccupancy: number;
}

export interface Recommendation {
  category: string;
  action: string;
  goal: string;
  impact: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface GuestSegment {
  name: string;
  percentage: number;
  characteristics: string[];
  personalizedOffers: {
    title: string;
    description: string;
    deliveryChannel: string;
  }[];
}

export interface RateAdjustment {
  segment: string;
  currentRate: number;
  recommendedRate: number;
  reason: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MarketAnalysis {
  recommendations: Recommendation[];
  marketSentiment: string;
  competitorTrends: string;
  groundingSources: GroundingSource[];
  segments: GuestSegment[];
  rateAdjustments: RateAdjustment[];
}

export interface ProfitProjection {
  month: string;
  actual?: number;
  projected: number;
}
