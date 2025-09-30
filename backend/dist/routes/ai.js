"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// AI recommendations endpoint
router.post('/recommendations', (req, res) => {
    res.json({
        success: true,
        recommendations: [
            {
                id: '1',
                type: 'design_optimization',
                confidence: 0.95,
                priority: 'high',
                title: 'Optimasi Dimensi Balok',
                description: 'Dimensi balok dapat dioptimalkan untuk efisiensi material'
            }
        ]
    });
});
exports.default = router;
//# sourceMappingURL=ai.js.map