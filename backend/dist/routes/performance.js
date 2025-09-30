"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Performance metrics endpoint
router.get('/metrics', (req, res) => {
    res.json({
        success: true,
        metrics: {
            structuralHealth: 95,
            loadCapacity: 87,
            safetyFactor: 2.1,
            materialUtilization: 78
        }
    });
});
exports.default = router;
//# sourceMappingURL=performance.js.map