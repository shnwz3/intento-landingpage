import type { PlanId } from './plans.js';

export type ProfileRow = {
  billing_status: string | null;
  created_at: string | null;
  credit_balance: number | null;
  current_period_end: string | null;
  daily_credit_limit: number | null;
  email: string;
  full_name: string | null;
  id: string;
  plan_id: PlanId | null;
  stripe_customer_id: string | null;
  updated_at: string | null;
};

export type ProfileInsert = {
  billing_status?: string | null;
  credit_balance?: number | null;
  current_period_end?: string | null;
  daily_credit_limit?: number | null;
  email: string;
  full_name?: string | null;
  id: string;
  plan_id?: PlanId | null;
  stripe_customer_id?: string | null;
  updated_at?: string | null;
};

export type SubscriptionRow = {
  created_at: string | null;
  credits_remaining: number | null;
  current_period_end: string | null;
  daily_credit_limit: number | null;
  plan_id: PlanId | null;
  status: string | null;
  stripe_customer_id: string | null;
  stripe_price_id: string | null;
  stripe_subscription_id: string | null;
  updated_at: string | null;
  user_id: string;
};

export type SubscriptionInsert = {
  credits_remaining?: number | null;
  current_period_end?: string | null;
  daily_credit_limit?: number | null;
  plan_id?: PlanId | null;
  status?: string | null;
  stripe_customer_id?: string | null;
  stripe_price_id?: string | null;
  stripe_subscription_id?: string | null;
  updated_at?: string | null;
  user_id: string;
};

export type UsageEventRow = {
  created_at: string | null;
  credits_delta: number;
  event_type: string;
  id: number;
  metadata: Record<string, unknown> | null;
  user_id: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Insert: ProfileInsert;
        Relationships: [];
        Row: ProfileRow;
        Update: Partial<ProfileInsert>;
      };
      subscriptions: {
        Insert: SubscriptionInsert;
        Relationships: [];
        Row: SubscriptionRow;
        Update: Partial<SubscriptionInsert>;
      };
      usage_events: {
        Insert: Omit<UsageEventRow, 'created_at' | 'id'>;
        Relationships: [];
        Row: UsageEventRow;
        Update: Partial<Omit<UsageEventRow, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
