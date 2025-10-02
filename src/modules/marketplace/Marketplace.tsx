/**
 * Marketplace Module
 * BIM plugins, analysis tools, templates, and resources marketplace
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Package, Download, Star, 
  Search, Filter, Tag, CreditCard, 
  User, Settings, Zap, FileText
} from 'lucide-react';

interface MarketplaceProps {
  subModule: string;
}

const Marketplace: React.FC<MarketplaceProps> = ({ subModule }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);

  // BIM Plugins Data
  const bimPlugins = [
    {
      id: 1,
      name: 'Revit Structure Bridge',
      version: '2024.1',
      price: 'Rp 1,299,000',
      rating: 4.8,
      downloads: 2450,
      description: 'Seamless integration between Revit Structure and structural analysis',
      features: [
        'Direct model import/export',
        'Material mapping',
        'Load transfer',
        'Result visualization'
      ],
      compatibility: ['Revit 2022', 'Revit 2023', 'Revit 2024'],
      developer: 'StructureTech Solutions',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      name: 'AutoCAD Structural Toolkit',
      version: '3.2',
      price: 'Rp 899,000',
      rating: 4.6,
      downloads: 1850,
      description: 'Advanced structural drafting and detailing tools for AutoCAD',
      features: [
        'Steel detailing automation',
        'Reinforcement drawing',
        'Section properties calculator',
        'Standard symbols library'
      ],
      compatibility: ['AutoCAD 2021', 'AutoCAD 2022', 'AutoCAD 2023'],
      developer: 'CAD Engineering Tools',
      lastUpdated: '2024-01-10'
    },
    {
      id: 3,
      name: 'Tekla Integration Suite',
      version: '1.5',
      price: 'Rp 1,799,000',
      rating: 4.9,
      downloads: 980,
      description: 'Professional integration with Tekla Structures for complex projects',
      features: [
        'Bi-directional data exchange',
        'Advanced steel connections',
        'Clash detection',
        'Progress tracking'
      ],
      compatibility: ['Tekla 2022', 'Tekla 2023'],
      developer: 'Advanced BIM Solutions',
      lastUpdated: '2024-01-12'
    }
  ];

  // Analysis Tools Data
  const analysisTools = [
    {
      id: 1,
      name: 'Advanced Seismic Analyzer',
      type: 'Analysis Tool',
      price: 'Rp 2,499,000',
      rating: 4.9,
      downloads: 1200,
      description: 'Professional seismic analysis tool with time-history and response spectrum',
      features: [
        'Non-linear time history analysis',
        'Advanced damping models',
        'Soil-structure interaction',
        'Multi-hazard assessment'
      ],
      requirements: ['Windows 10+', '8GB RAM', 'DirectX 11'],
      license: 'Annual Subscription'
    },
    {
      id: 2,
      name: 'Wind Load Calculator Pro',
      type: 'Calculation Tool',
      price: 'Rp 799,000',
      rating: 4.7,
      downloads: 2100,
      description: 'Comprehensive wind load analysis following multiple international standards',
      features: [
        'ASCE 7, Eurocode, SNI support',
        'Terrain analysis',
        'Building geometry optimization',
        'Automated report generation'
      ],
      requirements: ['Windows 10+', '4GB RAM'],
      license: 'Perpetual License'
    },
    {
      id: 3,
      name: 'Foundation Design Suite',
      type: 'Design Tool',
      price: 'Rp 1,599,000',
      rating: 4.8,
      downloads: 1650,
      description: 'Complete foundation design and analysis package',
      features: [
        'Shallow foundation design',
        'Deep foundation analysis',
        'Soil-structure interaction',
        'Settlement analysis'
      ],
      requirements: ['Windows 10+', '6GB RAM'],
      license: 'Annual Subscription'
    }
  ];

  // Design Templates Data
  const designTemplates = [
    {
      id: 1,
      name: 'High-Rise Building Templates',
      category: 'Building Templates',
      price: 'Rp 499,000',
      rating: 4.6,
      downloads: 3500,
      description: 'Pre-configured templates for high-rise residential and commercial buildings',
      includes: [
        '20+ building configurations',
        'Material libraries',
        'Load patterns',
        'Analysis settings'
      ],
      fileFormats: ['.str', '.sdb', '.json'],
      size: '125 MB'
    },
    {
      id: 2,
      name: 'Industrial Structures Pack',
      category: 'Industrial Templates',
      price: 'Rp 699,000',
      rating: 4.8,
      downloads: 1800,
      description: 'Comprehensive templates for industrial and warehouse structures',
      includes: [
        'Portal frame systems',
        'Crane beam designs',
        'Bracing configurations',
        'Connection details'
      ],
      fileFormats: ['.str', '.dwg', '.stp'],
      size: '89 MB'
    },
    {
      id: 3,
      name: 'Bridge Design Collection',
      category: 'Bridge Templates',
      price: 'Rp 899,000',
      rating: 4.9,
      downloads: 920,
      description: 'Professional bridge design templates and details',
      includes: [
        'Concrete bridge designs',
        'Steel bridge configurations',
        'Prestressed elements',
        'Connection details'
      ],
      fileFormats: ['.str', '.dwg', '.ifc'],
      size: '156 MB'
    }
  ];

  // Material Library Data
  const materialLibraries = [
    {
      id: 1,
      name: 'Indonesian Steel Database',
      type: 'Material Database',
      price: 'Rp 299,000',
      rating: 4.7,
      downloads: 4200,
      description: 'Complete database of Indonesian steel profiles and properties',
      includes: [
        '500+ steel sections',
        'SNI 1729 compliance',
        'Material properties',
        'Connection details'
      ],
      standards: ['SNI 1729:2020', 'AISC 360'],
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      name: 'Concrete Mix Library',
      type: 'Material Database',
      price: 'Rp 399,000',
      rating: 4.8,
      downloads: 3100,
      description: 'Comprehensive concrete mix designs and properties database',
      includes: [
        '200+ mix designs',
        'Regional aggregates',
        'Durability factors',
        'Cost optimization'
      ],
      standards: ['SNI 2847:2019', 'ACI 318'],
      lastUpdated: '2024-01-18'
    }
  ];

  const renderBIMPlugins = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Package className="w-6 h-6 mr-2 text-blue-400" />
            BIM Plugins
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bimPlugins.map(plugin => (
              <div key={plugin.id} className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white/90 font-bold text-lg">{plugin.name}</h4>
                    <p className="text-white/60 text-sm">v{plugin.version}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{plugin.price}</div>
                    <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                      <Star className="w-4 h-4" />
                      <span>{plugin.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">{plugin.description}</p>

                <div className="mb-4">
                  <h5 className="text-white/80 font-medium mb-2">Key Features:</h5>
                  <ul className="space-y-1">
                    {plugin.features.map((feature, index) => (
                      <li key={index} className="text-white/70 text-sm flex items-center space-x-2">
                        <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h5 className="text-white/80 font-medium mb-2">Compatibility:</h5>
                  <div className="flex flex-wrap gap-1">
                    {plugin.compatibility.map((comp, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                  <span>by {plugin.developer}</span>
                  <span>{plugin.downloads} downloads</span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Add to Cart</span>
                  </button>
                  <button className="p-2 bg-green-600/20 hover:bg-green-600/30 border border-green-400/20 rounded transition-all">
                    <Download className="w-4 h-4 text-green-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAnalysisTools = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-orange-400" />
            Analysis Tools
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {analysisTools.map(tool => (
              <div key={tool.id} className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white/90 font-bold text-lg">{tool.name}</h4>
                    <p className="text-orange-400 text-sm">{tool.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{tool.price}</div>
                    <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                      <Star className="w-4 h-4" />
                      <span>{tool.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">{tool.description}</p>

                <div className="mb-4">
                  <h5 className="text-white/80 font-medium mb-2">Features:</h5>
                  <ul className="space-y-1">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="text-white/70 text-sm flex items-center space-x-2">
                        <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h5 className="text-white/80 font-medium mb-2">Requirements:</h5>
                  <div className="space-y-1">
                    {tool.requirements.map((req, index) => (
                      <div key={index} className="text-white/60 text-xs">{req}</div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                  <span>{tool.license}</span>
                  <span>{tool.downloads} downloads</span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 p-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-400/20 rounded transition-all">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Purchase</span>
                  </button>
                  <button className="p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDesignTemplates = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-purple-400" />
            Design Templates
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {designTemplates.map(template => (
              <div key={template.id} className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white/90 font-bold text-lg">{template.name}</h4>
                    <p className="text-purple-400 text-sm">{template.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{template.price}</div>
                    <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                      <Star className="w-4 h-4" />
                      <span>{template.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">{template.description}</p>

                <div className="mb-4">
                  <h5 className="text-white/80 font-medium mb-2">Package Includes:</h5>
                  <ul className="space-y-1">
                    {template.includes.map((item, index) => (
                      <li key={index} className="text-white/70 text-sm flex items-center space-x-2">
                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="text-white/80 font-medium mb-1">File Formats:</h5>
                    <div className="flex flex-wrap gap-1">
                      {template.fileFormats.map((format, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white/80 font-medium mb-1">Package Size:</h5>
                    <div className="text-white/70 text-sm">{template.size}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                  <span>{template.downloads} downloads</span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 p-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/20 rounded transition-all">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Buy Templates</span>
                  </button>
                  <button className="p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                    <Download className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMaterialLibraries = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Tag className="w-6 h-6 mr-2 text-green-400" />
            Material Libraries
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {materialLibraries.map(library => (
              <div key={library.id} className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white/90 font-bold text-lg">{library.name}</h4>
                    <p className="text-green-400 text-sm">{library.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{library.price}</div>
                    <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                      <Star className="w-4 h-4" />
                      <span>{library.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">{library.description}</p>

                <div className="mb-4">
                  <h5 className="text-white/80 font-medium mb-2">Library Contents:</h5>
                  <ul className="space-y-1">
                    {library.includes.map((item, index) => (
                      <li key={index} className="text-white/70 text-sm flex items-center space-x-2">
                        <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h5 className="text-white/80 font-medium mb-2">Standards Compliance:</h5>
                  <div className="flex flex-wrap gap-2">
                    {library.standards.map((standard, index) => (
                      <span key={index} className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded">
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                  <span>Updated: {library.lastUpdated}</span>
                  <span>{library.downloads} downloads</span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 p-2 bg-green-600/20 hover:bg-green-600/30 border border-green-400/20 rounded transition-all">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Purchase Library</span>
                  </button>
                  <button className="p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                    <Download className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMyPurchases = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <User className="w-6 h-6 mr-2 text-cyan-400" />
            My Purchases
          </h3>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h4 className="text-white/90 font-medium mb-2">No Purchases Yet</h4>
            <p className="text-white/60 mb-6">Browse our marketplace to find plugins, tools, and templates for your structural analysis projects.</p>
            <button className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded-lg text-blue-400 transition-all">
              Explore Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderSubModule = () => {
    switch(subModule) {
      case 'bim-plugins':
        return renderBIMPlugins();
      case 'analysis-tools':
        return renderAnalysisTools();
      case 'design-templates':
        return renderDesignTemplates();
      case 'material-libraries':
        return renderMaterialLibraries();
      case 'my-purchases':
        return renderMyPurchases();
      case 'plugin-management':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Plugin Management</h3>
            <p className="text-white/60">Plugin management system coming soon...</p>
          </div>
        );
      case 'developer-resources':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Developer Resources</h3>
            <p className="text-white/60">Developer API and SDK documentation coming soon...</p>
          </div>
        );
      default:
        return renderBIMPlugins();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">Marketplace</h1>
          <p className="text-white/60">
            Professional plugins, tools, templates, and resources for structural engineering
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
            />
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20 transition-all">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 border border-blue-400/20 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-all">
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cart.length})</span>
            </button>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'bim-plugins', label: 'BIM Plugins' },
            { id: 'analysis-tools', label: 'Analysis Tools' },
            { id: 'design-templates', label: 'Design Templates' },
            { id: 'material-libraries', label: 'Material Libraries' },
            { id: 'my-purchases', label: 'My Purchases' }
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

export default Marketplace;