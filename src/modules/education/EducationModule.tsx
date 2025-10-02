/**
 * Learning Education Module
 * Comprehensive educational resources for structural engineering
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, PlayCircle, FileText, 
  Award, Users, MessageCircle, Search, 
  Clock, Star, Download, ChevronRight
} from 'lucide-react';

interface EducationModuleProps {
  subModule: string;
}

const EducationModule: React.FC<EducationModuleProps> = ({ subModule }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentCourse, setCurrentCourse] = useState<any>(null);

  // Tutorial Library Data
  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with Structural Analysis',
      category: 'beginner',
      duration: '15 min',
      rating: 4.8,
      views: 1250,
      description: 'Learn the fundamentals of structural analysis using SNI standards',
      topics: ['Basic Concepts', 'SNI Standards', 'Load Types', 'Support Conditions'],
      difficulty: 'Beginner',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      title: 'Advanced Seismic Design - SNI 1726',
      category: 'advanced',
      duration: '45 min',
      rating: 4.9,
      views: 875,
      description: 'Comprehensive guide to seismic design following SNI 1726:2019',
      topics: ['Response Spectrum', 'Base Shear', 'Drift Control', 'Detailing'],
      difficulty: 'Advanced',
      lastUpdated: '2024-01-10'
    },
    {
      id: 3,
      title: 'Concrete Design with SNI 2847',
      category: 'intermediate',
      duration: '30 min',
      rating: 4.7,
      views: 940,
      description: 'Step-by-step concrete design process following Indonesian standards',
      topics: ['Flexural Design', 'Shear Design', 'Column Design', 'Reinforcement'],
      difficulty: 'Intermediate',
      lastUpdated: '2024-01-08'
    },
    {
      id: 4,
      title: 'Steel Connection Design',
      category: 'intermediate',
      duration: '25 min',
      rating: 4.6,
      views: 680,
      description: 'Design of steel connections according to SNI 1729',
      topics: ['Bolted Connections', 'Welded Connections', 'Moment Connections'],
      difficulty: 'Intermediate',
      lastUpdated: '2024-01-05'
    }
  ];

  // Video Courses Data
  const courses = [
    {
      id: 1,
      title: 'Complete Structural Analysis Course',
      instructor: 'Dr. Ahmad Structural, S.T., M.T.',
      duration: '8 hours',
      lessons: 24,
      rating: 4.9,
      students: 1200,
      price: 'Rp 499,000',
      level: 'All Levels',
      description: 'Master structural analysis from basics to advanced topics',
      modules: [
        'Introduction to Structural Analysis',
        'Static Analysis Methods',
        'Dynamic Analysis',
        'Seismic Design',
        'Practical Applications'
      ],
      image: '🏗️'
    },
    {
      id: 2,
      title: 'SNI Standards Mastery',
      instructor: 'Prof. Budi Engineering, Ph.D.',
      duration: '6 hours',
      lessons: 18,
      rating: 4.8,
      students: 890,
      price: 'Rp 399,000',
      level: 'Intermediate',
      description: 'Deep dive into Indonesian structural standards',
      modules: [
        'SNI 1726 - Seismic Design',
        'SNI 1727 - Load Standards',
        'SNI 2847 - Concrete Design',
        'SNI 1729 - Steel Design'
      ],
      image: '📚'
    }
  ];

  // Case Studies Data
  const caseStudies = [
    {
      id: 1,
      title: 'High-Rise Building Analysis',
      type: 'Residential Tower',
      location: 'Jakarta',
      height: '42 floors',
      complexity: 'High',
      description: 'Complete analysis of a 42-story residential tower in seismic zone',
      challenges: ['High seismic loads', 'Wind analysis', 'Foundation design'],
      solutions: ['Base isolation', 'Outrigger system', 'Pile foundation'],
      downloadable: true,
      fileSize: '15.2 MB'
    },
    {
      id: 2,
      title: 'Industrial Warehouse Design',
      type: 'Steel Structure',
      location: 'Surabaya',
      height: '12 meters',
      complexity: 'Medium',
      description: 'Large span steel warehouse with crane loads',
      challenges: ['Large spans', 'Crane loads', 'Lateral stability'],
      solutions: ['Portal frames', 'Bracing system', 'Moment connections'],
      downloadable: true,
      fileSize: '8.7 MB'
    },
    {
      id: 3,
      title: 'Bridge Structure Analysis',
      type: 'Concrete Bridge',
      location: 'Bandung',
      height: '25 meter span',
      complexity: 'High',
      description: 'Prestressed concrete bridge over river',
      challenges: ['Moving loads', 'Prestress losses', 'Durability'],
      solutions: ['Post-tensioning', 'Load distribution', 'Protective coating'],
      downloadable: true,
      fileSize: '22.1 MB'
    }
  ];

  // Best Practices Data
  const bestPractices = [
    {
      category: 'Modeling',
      title: 'Efficient Structural Modeling',
      practices: [
        'Use appropriate element types for each structural component',
        'Apply proper boundary conditions and constraints',
        'Verify model connectivity and stability',
        'Implement mesh refinement where needed'
      ]
    },
    {
      category: 'Analysis',
      title: 'Analysis Quality Control',
      practices: [
        'Perform static equilibrium checks',
        'Verify displacement compatibility',
        'Check for numerical stability',
        'Validate results against hand calculations'
      ]
    },
    {
      category: 'Design',
      title: 'Design Optimization',
      practices: [
        'Consider constructability in design',
        'Optimize material usage for economy',
        'Ensure adequate safety margins',
        'Follow detailing requirements strictly'
      ]
    }
  ];

  const renderTutorialLibrary = () => {
    const filteredTutorials = tutorials.filter(tutorial => 
      (selectedCategory === 'all' || tutorial.category === selectedCategory) &&
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-400" />
            Tutorial Library
          </h3>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
              />
            </div>
            <div className="flex space-x-2">
              {['all', 'beginner', 'intermediate', 'advanced'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-400/30'
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tutorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTutorials.map(tutorial => (
              <div key={tutorial.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-white/90 font-medium">{tutorial.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    tutorial.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-400' :
                    tutorial.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {tutorial.difficulty}
                  </span>
                </div>
                
                <p className="text-white/70 text-sm mb-3">{tutorial.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-white/60 mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{tutorial.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{tutorial.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{tutorial.views}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutorial.topics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                      {topic}
                    </span>
                  ))}
                </div>
                
                <button className="w-full flex items-center justify-center space-x-2 p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                  <PlayCircle className="w-4 h-4" />
                  <span className="text-sm">Start Tutorial</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderVideoCourses = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <PlayCircle className="w-6 h-6 mr-2 text-green-400" />
            Video Courses
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="text-3xl">{course.image}</div>
                  <div className="flex-1">
                    <h4 className="text-white/90 font-bold text-lg mb-1">{course.title}</h4>
                    <p className="text-white/70 text-sm mb-2">by {course.instructor}</p>
                    <p className="text-white/60 text-sm">{course.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/5 rounded">
                    <div className="text-white/60 text-xs">Duration</div>
                    <div className="text-white/90 font-medium">{course.duration}</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded">
                    <div className="text-white/60 text-xs">Lessons</div>
                    <div className="text-white/90 font-medium">{course.lessons}</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded">
                    <div className="text-white/60 text-xs">Students</div>
                    <div className="text-white/90 font-medium">{course.students}</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded">
                    <div className="text-white/60 text-xs">Rating</div>
                    <div className="text-yellow-400 font-medium flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-white/80 font-medium mb-2">Course Modules:</h5>
                  <div className="space-y-1">
                    {course.modules.map((module, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-white/70">
                        <ChevronRight className="w-3 h-3" />
                        <span>{module}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-green-400 font-bold text-lg">{course.price}</div>
                  <button className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-400/20 rounded transition-all">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCaseStudies = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-purple-400" />
            Case Studies
          </h3>

          <div className="space-y-6">
            {caseStudies.map(study => (
              <div key={study.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Project Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-white/90 font-bold text-lg mb-1">{study.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-white/70">
                          <span>{study.type}</span>
                          <span>•</span>
                          <span>{study.location}</span>
                          <span>•</span>
                          <span>{study.height}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm ${
                        study.complexity === 'High' ? 'bg-red-600/20 text-red-400' :
                        study.complexity === 'Medium' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-green-600/20 text-green-400'
                      }`}>
                        {study.complexity} Complexity
                      </span>
                    </div>

                    <p className="text-white/70 mb-4">{study.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-white/80 font-medium mb-2">Key Challenges:</h5>
                        <ul className="space-y-1">
                          {study.challenges.map((challenge, index) => (
                            <li key={index} className="text-white/70 text-sm flex items-center space-x-2">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-white/80 font-medium mb-2">Solutions Applied:</h5>
                        <ul className="space-y-1">
                          {study.solutions.map((solution, index) => (
                            <li key={index} className="text-white/70 text-sm flex items-center space-x-2">
                              <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                              <span>{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Download Section */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h5 className="text-white/80 font-medium mb-3">Download Resources</h5>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📁</div>
                        <div className="text-white/80 text-sm mb-1">Complete Analysis Files</div>
                        <div className="text-white/60 text-xs mb-3">{study.fileSize}</div>
                      </div>
                      <button 
                        className="w-full flex items-center justify-center space-x-2 p-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/20 rounded transition-all"
                        disabled={!study.downloadable}
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download Study</span>
                      </button>
                      <div className="text-white/60 text-xs text-center">
                        Includes: Models, Calculations, Reports
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBestPractices = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-400" />
            Best Practices
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {bestPractices.map((category, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h4 className="text-white/90 font-bold mb-3 flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    category.category === 'Modeling' ? 'bg-blue-400' :
                    category.category === 'Analysis' ? 'bg-green-400' : 'bg-purple-400'
                  }`}></span>
                  {category.title}
                </h4>
                <div className="space-y-3">
                  {category.practices.map((practice, practiceIndex) => (
                    <div key={practiceIndex} className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-white/70 text-sm">{practice}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCommunityForum = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-cyan-400" />
            Community Forum
          </h3>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h4 className="text-white/90 font-medium mb-2">Coming Soon</h4>
            <p className="text-white/60">Interactive community forum where engineers can discuss, share knowledge, and collaborate on structural engineering topics.</p>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderSubModule = () => {
    switch(subModule) {
      case 'tutorials':
        return renderTutorialLibrary();
      case 'courses':
        return renderVideoCourses();
      case 'case-studies':
        return renderCaseStudies();
      case 'documentation':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Documentation</h3>
            <p className="text-white/60">Comprehensive documentation coming soon...</p>
          </div>
        );
      case 'best-practices':
        return renderBestPractices();
      case 'certification':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Certification Programs</h3>
            <p className="text-white/60">Professional certification programs coming soon...</p>
          </div>
        );
      case 'community':
        return renderCommunityForum();
      case 'knowledge-base':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Knowledge Base</h3>
            <p className="text-white/60">Searchable knowledge base coming soon...</p>
          </div>
        );
      default:
        return renderTutorialLibrary();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">Learning Education</h1>
          <p className="text-white/60">
            Comprehensive educational resources for structural engineering professionals
          </p>
        </div>

        {/* Module Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'tutorials', label: 'Tutorials' },
            { id: 'courses', label: 'Video Courses' },
            { id: 'case-studies', label: 'Case Studies' },
            { id: 'best-practices', label: 'Best Practices' },
            { id: 'community', label: 'Community' }
          ].map(item => (
            <button
              key={item.id}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                subModule === item.id
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-400/30'
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderSubModule()}
      </div>
    </div>
  );
};

export default EducationModule;