const Turno = require('../models/Turno');
const Medicamento = require('../models/Medicamento');
const Estudio = require('../models/Estudio');
const { connectDatabase } = require('../config/dbConnections');

const achievements = [
    {
        id: 'first-appointment',
        title: 'Primer turno',
        description: 'Registra tu primer turno médico.',
        target: 1
    },
    {
        id: 'medication-routine',
        title: 'Mi tratamiento organizado',
        description: 'Registra un medicamento en tu seguimiento.',
        target: 1
    },
    {
        id: 'medical-history',
        title: 'Mi historia clínica',
        description: 'Guarda tu primer estudio médico.',
        target: 1
    }
];

async function getAchievementsForUser(userId) {
    await connectDatabase();

    const [appointments, medications, studies] = await Promise.all([
        Turno.countDocuments({
            usuarioId: userId,
            estado: { $nin: ['Cancelado', 'cancelado', 'CANCELADO', 'cancelled', 'CANCELLED'] },
            sagaStatus: { $ne: 'COMPENSATED' }
        }),
        Medicamento.countDocuments({ usuarioId: userId }),
        Estudio.countDocuments({ usuarioId: userId })
    ]);

    const progressByAchievement = {
        'first-appointment': appointments,
        'medication-routine': medications,
        'medical-history': studies
    };

    return achievements.map(({ target, ...achievement }) => {
        const current = progressByAchievement[achievement.id];
        return {
            ...achievement,
            obtained: current >= target,
            progress: { current: Math.min(current, target), target }
        };
    });
}

module.exports = { getAchievementsForUser };
