/**
 * Service contracts for the planned commercial backend.
 *
 * STATUS: interfaces only. None of these services is implemented yet – the live
 * app is fully client-side and stores progress in the browser through
 * `store/repository.ts`. These types document the boundaries so a backend can be
 * added without rewriting the UI. See docs/COMMERCIAL-ARCHITECTURE.md.
 */
import type { AppData, Question, TopicId } from '../types';
import type { HazardVideo } from '../data/hazardVideos';

export interface UserProfile { id: string; email: string; displayName: string; createdAt: string; plan: PlanId | null }

/** Planned: hosted identity provider (email + password, magic link), MFA for admins. */
export interface AuthService {
  register(email: string, password: string, displayName: string): Promise<UserProfile>;
  signIn(email: string, password: string): Promise<UserProfile>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  currentUser(): Promise<UserProfile | null>;
}

/** Planned: server copy of AppData with last-write-wins per record and conflict log. */
export interface SyncService {
  pull(userId: string): Promise<AppData | null>;
  push(userId: string, data: AppData, baseVersion: number): Promise<{ version: number }>;
}

export type ContentState = 'draft' | 'in-review' | 'verified' | 'published' | 'retired';

/** Planned: editorial workflow – nothing is published without a second reviewer. */
export interface ContentService {
  listQuestions(filter: { topic?: TopicId; state?: ContentState }): Promise<(Question & { state: ContentState })[]>;
  saveQuestion(q: Question, state: ContentState): Promise<void>;
  publish(ids: string[], reviewerId: string): Promise<void>;
  listVideos(): Promise<(HazardVideo & { state: ContentState })[]>;
}

export type PlanId = 'free' | 'monthly' | 'three-month';

/** Planned: payment provider checkout + webhooks; entitlements checked server-side. */
export interface BillingService {
  startCheckout(userId: string, plan: PlanId): Promise<{ checkoutUrl: string }>;
  entitlements(userId: string): Promise<{ plan: PlanId | null; renewsOn: string | null }>;
  invoices(userId: string): Promise<{ id: string; amountPence: number; issuedOn: string; url: string }[]>;
  cancel(userId: string): Promise<void>;
}
