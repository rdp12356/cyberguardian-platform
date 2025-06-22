import { User, Threat, Tool, GlossaryTerm, AnalyticsData, BlogPost, InsertUser, InsertThreat, InsertTool, InsertGlossaryTerm, InsertBlogPost } from '@shared/schema';

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  
  // Threat operations
  createThreat(threat: InsertThreat): Promise<Threat>;
  getAllThreats(): Promise<Threat[]>;
  getThreatById(id: string): Promise<Threat | null>;
  updateThreat(id: string, threat: Partial<InsertThreat>): Promise<Threat>;
  deleteThreat(id: string): Promise<boolean>;
  
  // Tool operations
  createTool(tool: InsertTool): Promise<Tool>;
  getAllTools(): Promise<Tool[]>;
  getToolById(id: string): Promise<Tool | null>;
  updateTool(id: string, tool: Partial<InsertTool>): Promise<Tool>;
  deleteTool(id: string): Promise<boolean>;
  
  // Glossary operations
  createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm>;
  getAllGlossaryTerms(): Promise<GlossaryTerm[]>;
  getGlossaryTermById(id: string): Promise<GlossaryTerm | null>;
  updateGlossaryTerm(id: string, term: Partial<InsertGlossaryTerm>): Promise<GlossaryTerm>;
  deleteGlossaryTerm(id: string): Promise<boolean>;
  
  // Blog operations
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: string): Promise<BlogPost | null>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<boolean>;
  
  // Analytics operations
  getAnalyticsData(): Promise<AnalyticsData[]>;
  addAnalyticsData(data: Omit<AnalyticsData, 'id'>): Promise<AnalyticsData>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private threats: Threat[] = [];
  private tools: Tool[] = [];
  private glossaryTerms: GlossaryTerm[] = [];
  private blogPosts: BlogPost[] = [];
  private analyticsData: AnalyticsData[] = [];

  constructor() {
    this.seedData();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private seedData() {
    // Seed sample data
    this.users = [
      {
        id: '1',
        email: 'admin@cyberguardian.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
      }
    ];

    this.threats = [
      {
        id: '1',
        title: 'Phishing Attacks',
        description: 'Fraudulent attempts to obtain sensitive information by disguising as trustworthy entities.',
        severity: 'high',
        category: 'Social Engineering',
        mitigation: 'Train employees to recognize phishing emails, implement email filtering, and use multi-factor authentication.',
        tags: ['email', 'social-engineering', 'credential-theft'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Ransomware',
        description: 'Malicious software that encrypts files and demands payment for decryption.',
        severity: 'critical',
        category: 'Malware',
        mitigation: 'Regular backups, endpoint protection, network segmentation, and incident response planning.',
        tags: ['malware', 'encryption', 'extortion'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        title: 'SQL Injection',
        description: 'Code injection technique that exploits vulnerabilities in web applications.',
        severity: 'high',
        category: 'Web Application',
        mitigation: 'Use parameterized queries, input validation, and web application firewalls.',
        tags: ['web-security', 'database', 'injection'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    this.tools = [
      {
        id: '1',
        name: 'Password Strength Checker',
        description: 'Analyze password strength and provide recommendations',
        category: 'Authentication',
        icon: 'Shield',
        isActive: true,
        features: ['Real-time analysis', 'Security recommendations', 'Policy compliance']
      },
      {
        id: '2',
        name: 'Vulnerability Scanner',
        description: 'Scan systems for known security vulnerabilities',
        category: 'Assessment',
        icon: 'Search',
        isActive: true,
        features: ['Automated scanning', 'Detailed reports', 'Risk prioritization']
      },
      {
        id: '3',
        name: 'Network Monitor',
        description: 'Monitor network traffic for suspicious activities',
        category: 'Monitoring',
        icon: 'Activity',
        isActive: true,
        features: ['Real-time monitoring', 'Anomaly detection', 'Alert system']
      },
      {
        id: '4',
        name: 'Incident Response',
        description: 'Manage and track security incidents',
        category: 'Response',
        icon: 'AlertTriangle',
        isActive: true,
        features: ['Incident tracking', 'Response workflows', 'Team collaboration']
      }
    ];

    this.glossaryTerms = [
      {
        id: '1',
        term: 'Malware',
        definition: 'Malicious software designed to damage, disrupt, or gain unauthorized access to computer systems.',
        category: 'General',
        relatedTerms: ['virus', 'trojan', 'ransomware']
      },
      {
        id: '2',
        term: 'Firewall',
        definition: 'A network security system that monitors and controls incoming and outgoing network traffic.',
        category: 'Network Security',
        relatedTerms: ['network', 'security', 'traffic-filtering']
      },
      {
        id: '3',
        term: 'Encryption',
        definition: 'The process of converting information into a coded format to prevent unauthorized access.',
        category: 'Cryptography',
        relatedTerms: ['cryptography', 'cipher', 'key']
      }
    ];

    this.analyticsData = [
      { id: '1', date: '2024-01', threats: 45, incidents: 12, resolved: 10, pending: 2 },
      { id: '2', date: '2024-02', threats: 52, incidents: 15, resolved: 13, pending: 2 },
      { id: '3', date: '2024-03', threats: 38, incidents: 8, resolved: 7, pending: 1 },
      { id: '4', date: '2024-04', threats: 61, incidents: 18, resolved: 15, pending: 3 },
      { id: '5', date: '2024-05', threats: 47, incidents: 11, resolved: 9, pending: 2 },
      { id: '6', date: '2024-06', threats: 55, incidents: 14, resolved: 12, pending: 2 }
    ];
  }

  // User operations
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  // Threat operations
  async createThreat(threat: InsertThreat): Promise<Threat> {
    const newThreat: Threat = {
      ...threat,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.threats.push(newThreat);
    return newThreat;
  }

  async getAllThreats(): Promise<Threat[]> {
    return this.threats;
  }

  async getThreatById(id: string): Promise<Threat | null> {
    return this.threats.find(threat => threat.id === id) || null;
  }

  async updateThreat(id: string, threat: Partial<InsertThreat>): Promise<Threat> {
    const index = this.threats.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Threat not found');
    
    this.threats[index] = {
      ...this.threats[index],
      ...threat,
      updatedAt: new Date(),
    };
    return this.threats[index];
  }

  async deleteThreat(id: string): Promise<boolean> {
    const index = this.threats.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.threats.splice(index, 1);
    return true;
  }

  // Tool operations
  async createTool(tool: InsertTool): Promise<Tool> {
    const newTool: Tool = {
      ...tool,
      id: this.generateId(),
    };
    this.tools.push(newTool);
    return newTool;
  }

  async getAllTools(): Promise<Tool[]> {
    return this.tools;
  }

  async getToolById(id: string): Promise<Tool | null> {
    return this.tools.find(tool => tool.id === id) || null;
  }

  async updateTool(id: string, tool: Partial<InsertTool>): Promise<Tool> {
    const index = this.tools.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tool not found');
    
    this.tools[index] = { ...this.tools[index], ...tool };
    return this.tools[index];
  }

  async deleteTool(id: string): Promise<boolean> {
    const index = this.tools.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.tools.splice(index, 1);
    return true;
  }

  // Glossary operations
  async createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const newTerm: GlossaryTerm = {
      ...term,
      id: this.generateId(),
    };
    this.glossaryTerms.push(newTerm);
    return newTerm;
  }

  async getAllGlossaryTerms(): Promise<GlossaryTerm[]> {
    return this.glossaryTerms;
  }

  async getGlossaryTermById(id: string): Promise<GlossaryTerm | null> {
    return this.glossaryTerms.find(term => term.id === id) || null;
  }

  async updateGlossaryTerm(id: string, term: Partial<InsertGlossaryTerm>): Promise<GlossaryTerm> {
    const index = this.glossaryTerms.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Glossary term not found');
    
    this.glossaryTerms[index] = { ...this.glossaryTerms[index], ...term };
    return this.glossaryTerms[index];
  }

  async deleteGlossaryTerm(id: string): Promise<boolean> {
    const index = this.glossaryTerms.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.glossaryTerms.splice(index, 1);
    return true;
  }

  // Blog operations
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.push(newPost);
    return newPost;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts;
  }

  async getBlogPostById(id: string): Promise<BlogPost | null> {
    return this.blogPosts.find(post => post.id === id) || null;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const index = this.blogPosts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Blog post not found');
    
    this.blogPosts[index] = {
      ...this.blogPosts[index],
      ...post,
      updatedAt: new Date(),
    };
    return this.blogPosts[index];
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const index = this.blogPosts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.blogPosts.splice(index, 1);
    return true;
  }

  // Analytics operations
  async getAnalyticsData(): Promise<AnalyticsData[]> {
    return this.analyticsData;
  }

  async addAnalyticsData(data: Omit<AnalyticsData, 'id'>): Promise<AnalyticsData> {
    const newData: AnalyticsData = {
      ...data,
      id: this.generateId(),
    };
    this.analyticsData.push(newData);
    return newData;
  }
}