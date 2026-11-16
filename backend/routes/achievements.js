const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getAchievementsForUser } = require('../services/achievementService');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const achievements = await getAchievementsForUser(req.userId);
        return res.json({ achievements });
    } catch (error) {
        console.error('Error al consultar logros:', error.message);
        return res.status(503).json({ mensaje: 'No fue posible consultar los logros' });
    }
});

module.exports = router;
