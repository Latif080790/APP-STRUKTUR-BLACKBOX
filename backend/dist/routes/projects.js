"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Get all projects
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: '1',
                name: 'Gedung Perkantoran 15 Lantai',
                description: 'Struktur beton bertulang dengan sistem rangka terbuka',
                location: 'Jakarta, Indonesia',
                status: 'active',
                projectType: 'building',
                createdAt: new Date().toISOString()
            }
        ]
    });
});
exports.default = router;
//# sourceMappingURL=projects.js.map