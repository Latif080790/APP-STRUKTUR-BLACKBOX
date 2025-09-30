"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Get current user
router.get('/me', (req, res) => {
    res.json({
        success: true,
        user: {
            id: '1',
            email: 'engineer@example.com',
            fullName: 'Demo Engineer',
            organization: 'Structural Engineering Firm',
            role: 'engineer'
        }
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map