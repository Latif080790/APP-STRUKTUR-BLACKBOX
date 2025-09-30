"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Sample material data sesuai standar SNI
const materials = [
    {
        id: '1',
        name: 'Beton Normal C25/30',
        category: 'concrete',
        grade: 'C25/30',
        standard: 'SNI 2847-2019',
        properties: {
            fc: 25, // MPa
            ft: 2.5, // MPa  
            E: 25000, // MPa
            density: 2400, // kg/m³
            poisson: 0.2
        },
        testResults: [
            { testType: 'Compressive Strength', result: 26.8, unit: 'MPa', date: '2024-01-15', status: 'pass' }
        ],
        sustainabilityMetrics: {
            carbonFootprint: 350,
            recyclability: 6.5,
            sustainabilityScore: 7.0
        },
        costPerUnit: 120,
        supplier: 'PT Beton Indonesia'
    }
];
// Get all materials
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: materials,
        total: materials.length
    });
});
exports.default = router;
//# sourceMappingURL=materials.js.map