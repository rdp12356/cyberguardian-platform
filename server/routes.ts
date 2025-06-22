import express from 'express';
import { z } from 'zod';
import { IStorage } from './storage';
import { insertThreatSchema, insertToolSchema, insertGlossaryTermSchema, insertBlogPostSchema } from '@shared/schema';

export function createRouter(storage: IStorage) {
  const router = express.Router();

  // Threats routes
  router.get('/api/threats', async (req, res) => {
    try {
      const threats = await storage.getAllThreats();
      res.json(threats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch threats' });
    }
  });

  router.get('/api/threats/:id', async (req, res) => {
    try {
      const threat = await storage.getThreatById(req.params.id);
      if (!threat) {
        return res.status(404).json({ error: 'Threat not found' });
      }
      res.json(threat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch threat' });
    }
  });

  router.post('/api/threats', async (req, res) => {
    try {
      const validatedData = insertThreatSchema.parse(req.body);
      const threat = await storage.createThreat(validatedData);
      res.status(201).json(threat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create threat' });
    }
  });

  router.patch('/api/threats/:id', async (req, res) => {
    try {
      const partialData = insertThreatSchema.partial().parse(req.body);
      const threat = await storage.updateThreat(req.params.id, partialData);
      res.json(threat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update threat' });
    }
  });

  router.delete('/api/threats/:id', async (req, res) => {
    try {
      const success = await storage.deleteThreat(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Threat not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete threat' });
    }
  });

  // Tools routes
  router.get('/api/tools', async (req, res) => {
    try {
      const tools = await storage.getAllTools();
      res.json(tools);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tools' });
    }
  });

  router.get('/api/tools/:id', async (req, res) => {
    try {
      const tool = await storage.getToolById(req.params.id);
      if (!tool) {
        return res.status(404).json({ error: 'Tool not found' });
      }
      res.json(tool);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tool' });
    }
  });

  router.post('/api/tools', async (req, res) => {
    try {
      const validatedData = insertToolSchema.parse(req.body);
      const tool = await storage.createTool(validatedData);
      res.status(201).json(tool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create tool' });
    }
  });

  router.patch('/api/tools/:id', async (req, res) => {
    try {
      const partialData = insertToolSchema.partial().parse(req.body);
      const tool = await storage.updateTool(req.params.id, partialData);
      res.json(tool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update tool' });
    }
  });

  router.delete('/api/tools/:id', async (req, res) => {
    try {
      const success = await storage.deleteTool(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Tool not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete tool' });
    }
  });

  // Glossary routes
  router.get('/api/glossary', async (req, res) => {
    try {
      const terms = await storage.getAllGlossaryTerms();
      res.json(terms);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch glossary terms' });
    }
  });

  router.get('/api/glossary/:id', async (req, res) => {
    try {
      const term = await storage.getGlossaryTermById(req.params.id);
      if (!term) {
        return res.status(404).json({ error: 'Glossary term not found' });
      }
      res.json(term);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch glossary term' });
    }
  });

  router.post('/api/glossary', async (req, res) => {
    try {
      const validatedData = insertGlossaryTermSchema.parse(req.body);
      const term = await storage.createGlossaryTerm(validatedData);
      res.status(201).json(term);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create glossary term' });
    }
  });

  router.patch('/api/glossary/:id', async (req, res) => {
    try {
      const partialData = insertGlossaryTermSchema.partial().parse(req.body);
      const term = await storage.updateGlossaryTerm(req.params.id, partialData);
      res.json(term);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update glossary term' });
    }
  });

  router.delete('/api/glossary/:id', async (req, res) => {
    try {
      const success = await storage.deleteGlossaryTerm(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Glossary term not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete glossary term' });
    }
  });

  // Blog routes
  router.get('/api/blog', async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  router.get('/api/blog/:id', async (req, res) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });

  router.post('/api/blog', async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  });

  router.patch('/api/blog/:id', async (req, res) => {
    try {
      const partialData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, partialData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update blog post' });
    }
  });

  router.delete('/api/blog/:id', async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete blog post' });
    }
  });

  // Analytics routes
  router.get('/api/analytics', async (req, res) => {
    try {
      const data = await storage.getAnalyticsData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
  });

  router.post('/api/analytics', async (req, res) => {
    try {
      const schema = z.object({
        date: z.string(),
        threats: z.number(),
        incidents: z.number(),
        resolved: z.number(),
        pending: z.number(),
      });
      const validatedData = schema.parse(req.body);
      const data = await storage.addAnalyticsData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to add analytics data' });
    }
  });

  // Password strength checker tool
  router.post('/api/tools/password-check', async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password),
      };

      const score = Object.values(checks).filter(Boolean).length;
      let strength = 'Very Weak';
      let color = 'red';

      if (score === 5) {
        strength = 'Very Strong';
        color = 'green';
      } else if (score === 4) {
        strength = 'Strong';
        color = 'yellow';
      } else if (score === 3) {
        strength = 'Medium';
        color = 'orange';
      } else if (score === 2) {
        strength = 'Weak';
        color = 'red';
      }

      const recommendations = [];
      if (!checks.length) recommendations.push('Use at least 8 characters');
      if (!checks.uppercase) recommendations.push('Add uppercase letters');
      if (!checks.lowercase) recommendations.push('Add lowercase letters');
      if (!checks.numbers) recommendations.push('Add numbers');
      if (!checks.symbols) recommendations.push('Add special characters');

      res.json({
        strength,
        score,
        color,
        checks,
        recommendations,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check password strength' });
    }
  });

  // Vulnerability scanner simulation
  router.post('/api/tools/vulnerability-scan', async (req, res) => {
    try {
      const { target } = req.body;
      if (!target) {
        return res.status(400).json({ error: 'Target is required' });
      }

      // Simulate vulnerability scan results
      const vulnerabilities = [
        {
          id: 'CVE-2024-0001',
          severity: 'High',
          title: 'SQL Injection Vulnerability',
          description: 'Potential SQL injection in user input validation',
          risk: 8.5,
          solution: 'Implement parameterized queries and input validation',
        },
        {
          id: 'CVE-2024-0002',
          severity: 'Medium',
          title: 'Cross-Site Scripting (XSS)',
          description: 'Reflected XSS vulnerability in search functionality',
          risk: 6.2,
          solution: 'Sanitize user input and implement Content Security Policy',
        },
        {
          id: 'CVE-2024-0003',
          severity: 'Low',
          title: 'Information Disclosure',
          description: 'Server version information exposed in headers',
          risk: 3.1,
          solution: 'Configure web server to hide version information',
        },
      ];

      res.json({
        target,
        scanDate: new Date().toISOString(),
        vulnerabilities,
        summary: {
          total: vulnerabilities.length,
          high: vulnerabilities.filter(v => v.severity === 'High').length,
          medium: vulnerabilities.filter(v => v.severity === 'Medium').length,
          low: vulnerabilities.filter(v => v.severity === 'Low').length,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to perform vulnerability scan' });
    }
  });

  return router;
}