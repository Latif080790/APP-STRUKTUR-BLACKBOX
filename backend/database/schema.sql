-- Database Schema untuk Sistem Analisis Struktur
-- Mengikuti standar SNI dan international codes

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    role VARCHAR(50) DEFAULT 'engineer' CHECK (role IN ('admin', 'engineer', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    project_type VARCHAR(50) DEFAULT 'building' CHECK (project_type IN ('building', 'bridge', 'industrial', 'infrastructure')),
    seismic_zone VARCHAR(10),
    wind_speed DECIMAL(6,2),
    soil_type VARCHAR(50),
    building_height DECIMAL(8,2),
    occupancy_type VARCHAR(100),
    design_codes JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Materials table - mengikuti standar SNI dan international
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('concrete', 'steel', 'timber', 'masonry', 'composite', 'aluminum')),
    grade VARCHAR(50) NOT NULL,
    standard VARCHAR(100) NOT NULL, -- SNI, ASTM, EN, JIS, etc.
    properties JSONB NOT NULL,
    test_results JSONB DEFAULT '[]',
    sustainability_metrics JSONB,
    cost_per_unit DECIMAL(10,2),
    availability_regions TEXT[],
    supplier VARCHAR(255),
    certifications TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Structural models table
CREATE TABLE structural_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    model_data JSONB NOT NULL, -- nodes, elements, loads, constraints
    analysis_type VARCHAR(50) DEFAULT 'linear_static',
    units JSONB DEFAULT '{"length": "m", "force": "kN", "stress": "MPa"}',
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analysis results table
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES structural_models(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50) NOT NULL,
    load_case VARCHAR(100) NOT NULL,
    results JSONB NOT NULL, -- displacements, forces, stresses
    summary JSONB, -- max values, critical points
    warnings TEXT[],
    computation_time DECIMAL(8,3),
    solver_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI analysis table
CREATE TABLE ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50) NOT NULL,
    input_features JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    confidence_scores JSONB,
    optimization_results JSONB,
    model_version VARCHAR(50),
    processing_time DECIMAL(8,3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BIM integration table
CREATE TABLE bim_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_format VARCHAR(10) CHECK (file_format IN ('ifc', 'dwg', 'rvt', 'skp')),
    file_path VARCHAR(500),
    file_size BIGINT,
    metadata JSONB,
    geometry_data JSONB,
    material_mapping JSONB,
    import_log TEXT,
    status VARCHAR(50) DEFAULT 'imported',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance monitoring table
CREATE TABLE performance_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    value DECIMAL(12,4) NOT NULL,
    unit VARCHAR(20),
    location JSONB, -- coordinates or element reference
    sensor_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quality_flag VARCHAR(20) DEFAULT 'good'
);

-- Load cases table
CREATE TABLE load_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES structural_models(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('dead', 'live', 'wind', 'seismic', 'thermal', 'construction')),
    factor DECIMAL(4,2) DEFAULT 1.0,
    loads JSONB NOT NULL,
    combinations JSONB,
    code_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Design codes table
CREATE TABLE design_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    version VARCHAR(20),
    country VARCHAR(50),
    scope VARCHAR(100),
    parameters JSONB,
    is_active BOOLEAN DEFAULT true
);

-- Project collaborators table
CREATE TABLE project_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
    permissions JSONB DEFAULT '[]',
    invited_by UUID REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- File attachments table
CREATE TABLE file_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    category VARCHAR(50) DEFAULT 'document',
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default design codes
INSERT INTO design_codes (name, code, version, country, scope, parameters) VALUES
('SNI 1726 - Gempa', 'SNI1726', '2019', 'Indonesia', 'Seismic loads', '{"Ss_max": 2.5, "S1_max": 1.0}'),
('SNI 1727 - Beban', 'SNI1727', '2020', 'Indonesia', 'Load combinations', '{"live_load_reduction": true}'),
('SNI 2847 - Beton', 'SNI2847', '2019', 'Indonesia', 'Concrete design', '{"phi_factor": 0.9}'),
('SNI 1729 - Baja', 'SNI1729', '2020', 'Indonesia', 'Steel design', '{"phi_factor": 0.9}'),
('ACI 318', 'ACI318', '2019', 'USA', 'Concrete structures', '{"phi_factor": 0.9}'),
('AISC 360', 'AISC360', '2016', 'USA', 'Steel construction', '{"phi_factor": 0.9}'),
('Eurocode 2', 'EC2', '2004', 'Europe', 'Concrete structures', '{"gamma_c": 1.5}'),
('Eurocode 3', 'EC3', '2005', 'Europe', 'Steel structures', '{"gamma_M0": 1.0}');

-- Insert sample materials
INSERT INTO materials (name, category, grade, standard, properties, sustainability_metrics, cost_per_unit) VALUES
('Beton Normal', 'concrete', 'C25/30', 'SNI 2847-2019', 
 '{"fc": 25, "ft": 2.5, "E": 25000, "density": 2400, "poisson": 0.2}',
 '{"carbon_footprint": 350, "recyclability": 6.5, "sustainability_score": 7.0}', 120),
('Baja Struktural', 'steel', 'BJ 37', 'SNI 1729-2020',
 '{"fy": 240, "fu": 370, "E": 200000, "density": 7850, "poisson": 0.3}',
 '{"carbon_footprint": 2100, "recyclability": 9.5, "sustainability_score": 8.0}', 850),
('Beton Mutu Tinggi', 'concrete', 'C40/50', 'SNI 2847-2019',
 '{"fc": 40, "ft": 3.5, "E": 34000, "density": 2400, "poisson": 0.2}',
 '{"carbon_footprint": 420, "recyclability": 6.0, "sustainability_score": 7.5}', 180);

-- Indexes for performance
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_models_project ON structural_models(project_id);
CREATE INDEX idx_results_model ON analysis_results(model_id);
CREATE INDEX idx_performance_project_time ON performance_monitoring(project_id, timestamp);
CREATE INDEX idx_materials_category ON materials(category);
CREATE INDEX idx_collaborators_project ON project_collaborators(project_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON structural_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bim_updated_at BEFORE UPDATE ON bim_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();