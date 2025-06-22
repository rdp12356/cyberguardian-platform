import { z } from 'zod';

// User schema
export const User = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'user']),
  createdAt: z.date(),
});

export type User = z.infer<typeof User>;

// Threat schema
export const Threat = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.string(),
  mitigation: z.string(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Threat = z.infer<typeof Threat>;

// Tool schema
export const Tool = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  icon: z.string(),
  url: z.string().optional(),
  isActive: z.boolean(),
  features: z.array(z.string()),
});

export type Tool = z.infer<typeof Tool>;

// Glossary term schema
export const GlossaryTerm = z.object({
  id: z.string(),
  term: z.string(),
  definition: z.string(),
  category: z.string(),
  relatedTerms: z.array(z.string()),
});

export type GlossaryTerm = z.infer<typeof GlossaryTerm>;

// Analytics data schema
export const AnalyticsData = z.object({
  id: z.string(),
  date: z.string(),
  threats: z.number(),
  incidents: z.number(),
  resolved: z.number(),
  pending: z.number(),
});

export type AnalyticsData = z.infer<typeof AnalyticsData>;

// Blog post schema
export const BlogPost = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
  published: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BlogPost = z.infer<typeof BlogPost>;

// Insert schemas
export const insertUserSchema = User.omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertThreatSchema = Threat.omit({ id: true, createdAt: true, updatedAt: true });
export type InsertThreat = z.infer<typeof insertThreatSchema>;

export const insertToolSchema = Tool.omit({ id: true });
export type InsertTool = z.infer<typeof insertToolSchema>;

export const insertGlossaryTermSchema = GlossaryTerm.omit({ id: true });
export type InsertGlossaryTerm = z.infer<typeof insertGlossaryTermSchema>;

export const insertBlogPostSchema = BlogPost.omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;