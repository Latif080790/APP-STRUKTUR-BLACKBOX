/**
 * Enhanced Project Management System
 * Sistem manajemen proyek terintegrasi dengan collaboration features
 */

export interface ProjectMember {
  id: string;
  name: string;
  role: 'lead_engineer' | 'structural_engineer' | 'architect' | 'reviewer' | 'client';
  permissions: ProjectPermission[];
  status: 'online' | 'offline' | 'busy';
  lastActivity: Date;
  avatar?: string;
}

export interface ProjectPermission {
  action: 'view' | 'edit' | 'analyze' | 'export' | 'approve' | 'admin';
  scope: 'geometry' | 'materials' | 'loads' | 'results' | 'reports' | 'all';
}

export interface ProjectMetadata {
  id: string;
  name: string;
  description: string;
  client: string;
  location: {
    address: string;
    city: string;
    province: string;
    coordinates?: { lat: number; lng: number; };
    seismicZone: 'low' | 'medium' | 'high';
  };
  buildingInfo: {
    type: 'residential' | 'commercial' | 'industrial' | 'institutional';
    floors: number;
    height: number;
    area: number;
    occupancy: string;
  };
  standards: {
    structural: string[];
    building: string[];
    seismic: string[];
    fire: string[];
  };
  timeline: {
    start: Date;
    phases: ProjectPhase[];
    milestones: ProjectMilestone[];
    deadline: Date;
  };
  budget: {
    total: number;
    allocated: number;
    spent: number;
    currency: 'IDR' | 'USD';
  };
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'active' | 'completed' | 'delayed';
  progress: number;
  deliverables: string[];
  dependencies: string[];
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'achieved' | 'missed';
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export interface ProjectActivity {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  description: string;
  category: 'analysis' | 'design' | 'review' | 'approval' | 'export';
  details?: any;
}

export class ProjectManager {
  private currentProject: ProjectMetadata | null = null;
  private members: ProjectMember[] = [];
  private activities: ProjectActivity[] = [];
  private listeners: Array<(project: ProjectMetadata | null) => void> = [];

  constructor() {
    this.initializeDemoProject();
  }

  private initializeDemoProject() {
    // Inisialisasi proyek demo profesional
    this.currentProject = {
      id: 'proj_001',
      name: 'Gedung Perkantoran Thamrin Plaza',
      description: 'Gedung perkantoran 25 lantai dengan struktur beton bertulang dan baja',
      client: 'PT. Pembangunan Jaya',
      location: {
        address: 'Jl. M.H. Thamrin No. 10',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
        coordinates: { lat: -6.1944, lng: 106.8229 },
        seismicZone: 'medium'
      },
      buildingInfo: {
        type: 'commercial',
        floors: 25,
        height: 100,
        area: 15000,
        occupancy: 'Office Building'
      },
      standards: {
        structural: ['SNI 1726-2019', 'SNI 1727-2020', 'SNI 2847-2019', 'SNI 1729-2015'],
        building: ['SNI 03-1734-2019', 'SNI 03-1735-2019'],
        seismic: ['SNI 1726-2019', 'ASCE 7-16'],
        fire: ['SNI 03-3989-2000', 'NFPA 101']
      },
      timeline: {
        start: new Date('2024-01-01'),
        deadline: new Date('2024-06-30'),
        phases: [
          {
            id: 'phase_1',
            name: 'Preliminary Design',
            description: 'Desain konseptual dan analisis awal',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-15'),
            status: 'completed',
            progress: 100,
            deliverables: ['Konsep struktur', 'Load calculation', 'Preliminary analysis'],
            dependencies: []
          },
          {
            id: 'phase_2',
            name: 'Detailed Design',
            description: 'Desain detail dan analisis komprehensif',
            startDate: new Date('2024-02-15'),
            endDate: new Date('2024-04-30'),
            status: 'active',
            progress: 75,
            deliverables: ['Detailed drawings', 'Analysis reports', 'Material specifications'],
            dependencies: ['phase_1']
          },
          {
            id: 'phase_3',
            name: 'Construction Documents',
            description: 'Dokumen konstruksi dan tender',
            startDate: new Date('2024-05-01'),
            endDate: new Date('2024-06-30'),
            status: 'pending',
            progress: 0,
            deliverables: ['Construction drawings', 'Specifications', 'Bills of quantities'],
            dependencies: ['phase_2']
          }
        ],
        milestones: [
          {
            id: 'milestone_1',
            name: 'Design Approval',
            description: 'Persetujuan desain oleh klien dan otoritas',
            dueDate: new Date('2024-03-15'),
            status: 'achieved',
            importance: 'critical'
          },
          {
            id: 'milestone_2',
            name: 'Peer Review Completion',
            description: 'Review oleh independent structural engineer',
            dueDate: new Date('2024-04-15'),
            status: 'pending',
            importance: 'high'
          }
        ]
      },
      budget: {
        total: 2500000000, // 2.5 Milyar IDR
        allocated: 2000000000,
        spent: 1200000000,
        currency: 'IDR'
      }
    };

    // Initialize team members
    this.members = [
      {
        id: 'user_001',
        name: 'Ir. Ahmad Subrata, M.T.',
        role: 'lead_engineer',
        permissions: [
          { action: 'admin', scope: 'all' }
        ],
        status: 'online',
        lastActivity: new Date(),
        avatar: '👨‍💼'
      },
      {
        id: 'user_002',
        name: 'Sari Dewi, S.T.',
        role: 'structural_engineer',
        permissions: [
          { action: 'edit', scope: 'geometry' },
          { action: 'edit', scope: 'materials' },
          { action: 'analyze', scope: 'all' }
        ],
        status: 'online',
        lastActivity: new Date(Date.now() - 300000), // 5 menit lalu
        avatar: '👩‍💼'
      },
      {
        id: 'user_003',
        name: 'Budi Hartono, S.T., M.T.',
        role: 'reviewer',
        permissions: [
          { action: 'view', scope: 'all' },
          { action: 'approve', scope: 'results' }
        ],
        status: 'busy',
        lastActivity: new Date(Date.now() - 900000), // 15 menit lalu
        avatar: '👨‍🔬'
      },
      {
        id: 'user_004',
        name: 'Maya Sari, S.Ars.',
        role: 'architect',
        permissions: [
          { action: 'view', scope: 'geometry' },
          { action: 'edit', scope: 'geometry' }
        ],
        status: 'offline',
        lastActivity: new Date(Date.now() - 3600000), // 1 jam lalu
        avatar: '👩‍🎨'
      }
    ];

    // Initialize recent activities
    this.activities = [
      {
        id: 'act_001',
        timestamp: new Date(),
        user: 'Ir. Ahmad Subrata, M.T.',
        action: 'Analisis Seismik Selesai',
        description: 'Analisis response spectrum berhasil diselesaikan dengan safety factor 2.45',
        category: 'analysis',
        details: { safetyFactor: 2.45, maxDisplacement: 125.3 }
      },
      {
        id: 'act_002',
        timestamp: new Date(Date.now() - 300000),
        user: 'Sari Dewi, S.T.',
        action: 'Material Updated',
        description: 'Material beton diupdate ke K-350 sesuai rekomendasi',
        category: 'design',
        details: { oldGrade: 'K-300', newGrade: 'K-350' }
      },
      {
        id: 'act_003',
        timestamp: new Date(Date.now() - 600000),
        user: 'Budi Hartono, S.T., M.T.',
        action: 'Review Completed',
        description: 'Review struktur lantai 15-20 selesai dengan catatan minor',
        category: 'review',
        details: { floors: '15-20', issues: 'minor' }
      }
    ];

    this.notifyListeners();
  }

  public getCurrentProject(): ProjectMetadata | null {
    return this.currentProject;
  }

  public getProjectMembers(): ProjectMember[] {
    return [...this.members];
  }

  public getRecentActivities(limit: number = 10): ProjectActivity[] {
    return this.activities.slice(0, limit);
  }

  public addActivity(activity: Omit<ProjectActivity, 'id' | 'timestamp'>): void {
    const newActivity: ProjectActivity = {
      ...activity,
      id: `act_${Date.now()}`,
      timestamp: new Date()
    };

    this.activities.unshift(newActivity);
    
    // Keep only last 100 activities untuk performance
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(0, 100);
    }
  }

  public updateMemberStatus(userId: string, status: 'online' | 'offline' | 'busy'): void {
    const member = this.members.find(m => m.id === userId);
    if (member) {
      member.status = status;
      member.lastActivity = new Date();
    }
  }

  public getProjectProgress(): {
    overall: number;
    phases: { name: string; progress: number; status: string; }[];
    milestones: { name: string; status: string; dueDate: Date; }[];
  } {
    if (!this.currentProject) {
      return { overall: 0, phases: [], milestones: [] };
    }

    const phases = this.currentProject.timeline.phases.map(phase => ({
      name: phase.name,
      progress: phase.progress,
      status: phase.status
    }));

    const milestones = this.currentProject.timeline.milestones.map(milestone => ({
      name: milestone.name,
      status: milestone.status,
      dueDate: milestone.dueDate
    }));

    // Calculate overall progress berdasarkan weighted average phases
    const totalWeight = this.currentProject.timeline.phases.length;
    const weightedProgress = this.currentProject.timeline.phases.reduce(
      (sum, phase) => sum + phase.progress, 0
    );
    const overall = Math.round(weightedProgress / totalWeight);

    return { overall, phases, milestones };
  }

  public getBudgetStatus(): {
    total: number;
    allocated: number;
    spent: number;
    remaining: number;
    utilization: number;
    currency: string;
  } {
    if (!this.currentProject) {
      return { total: 0, allocated: 0, spent: 0, remaining: 0, utilization: 0, currency: 'IDR' };
    }

    const { total, allocated, spent, currency } = this.currentProject.budget;
    const remaining = allocated - spent;
    const utilization = Math.round((spent / allocated) * 100);

    return { total, allocated, spent, remaining, utilization, currency };
  }

  public getComplianceStatus(): {
    standards: string[];
    verified: string[];
    pending: string[];
    compliance_rate: number;
  } {
    if (!this.currentProject) {
      return { standards: [], verified: [], pending: [], compliance_rate: 0 };
    }

    const allStandards = [
      ...this.currentProject.standards.structural,
      ...this.currentProject.standards.building,
      ...this.currentProject.standards.seismic
    ];

    // Simulasi status compliance
    const verified = allStandards.filter((_, index) => index < allStandards.length * 0.8);
    const pending = allStandards.filter((_, index) => index >= allStandards.length * 0.8);
    const compliance_rate = Math.round((verified.length / allStandards.length) * 100);

    return {
      standards: allStandards,
      verified,
      pending,
      compliance_rate
    };
  }

  public subscribe(listener: (project: ProjectMetadata | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentProject));
  }

  // Advanced project analytics
  public generateProjectReport(): {
    summary: any;
    timeline: any;
    team: any;
    compliance: any;
    budget: any;
    risks: any[];
  } {
    const progress = this.getProjectProgress();
    const budget = this.getBudgetStatus();
    const compliance = this.getComplianceStatus();

    return {
      summary: {
        name: this.currentProject?.name,
        status: progress.overall >= 100 ? 'completed' : progress.overall > 0 ? 'in_progress' : 'not_started',
        progress: progress.overall,
        daysRemaining: this.currentProject ? 
          Math.ceil((this.currentProject.timeline.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0
      },
      timeline: progress,
      team: {
        total: this.members.length,
        online: this.members.filter(m => m.status === 'online').length,
        roles: this.members.reduce((acc, member) => {
          acc[member.role] = (acc[member.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      compliance,
      budget,
      risks: this.identifyProjectRisks()
    };
  }

  private identifyProjectRisks(): any[] {
    const risks = [];
    const budget = this.getBudgetStatus();
    const progress = this.getProjectProgress();

    // Budget risk
    if (budget.utilization > 80) {
      risks.push({
        type: 'budget',
        level: 'high',
        description: 'Budget utilization melebihi 80%',
        recommendation: 'Review dan kontrol pengeluaran'
      });
    }

    // Timeline risk
    if (this.currentProject) {
      const daysRemaining = Math.ceil(
        (this.currentProject.timeline.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysRemaining < 30 && progress.overall < 90) {
        risks.push({
          type: 'timeline',
          level: 'medium',
          description: 'Kemungkinan delay untuk mencapai deadline',
          recommendation: 'Akselerasi aktivitas critical path'
        });
      }
    }

    // Team risk
    const onlineMembers = this.members.filter(m => m.status === 'online').length;
    if (onlineMembers < this.members.length * 0.5) {
      risks.push({
        type: 'team',
        level: 'medium',
        description: 'Kurang dari 50% tim online',
        recommendation: 'Koordinasi dan komunikasi tim'
      });
    }

    return risks;
  }
}

export default ProjectManager;