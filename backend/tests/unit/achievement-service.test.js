jest.mock('../../config/dbConnections', () => ({
    connectDatabase: jest.fn()
}));
jest.mock('../../models/Turno', () => ({
    countDocuments: jest.fn()
}));
jest.mock('../../models/Medicamento', () => ({
    countDocuments: jest.fn()
}));
jest.mock('../../models/Estudio', () => ({
    countDocuments: jest.fn()
}));

const { connectDatabase } = require('../../config/dbConnections');
const Turno = require('../../models/Turno');
const Medicamento = require('../../models/Medicamento');
const Estudio = require('../../models/Estudio');
const { getAchievementsForUser } = require('../../services/achievementService');

describe('getAchievementsForUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        connectDatabase.mockResolvedValue();
    });

    it('returns every available achievement as pending when the user has no records', async () => {
        Turno.countDocuments.mockResolvedValue(0);
        Medicamento.countDocuments.mockResolvedValue(0);
        Estudio.countDocuments.mockResolvedValue(0);

        const result = await getAchievementsForUser('patient-1');

        expect(result).toHaveLength(3);
        expect(result.every(achievement => !achievement.obtained)).toBe(true);
        expect(result.every(achievement => achievement.progress.current === 0)).toBe(true);
    });

    it('marks achievements obtained from the authenticated user records', async () => {
        Turno.countDocuments.mockResolvedValue(2);
        Medicamento.countDocuments.mockResolvedValue(1);
        Estudio.countDocuments.mockResolvedValue(0);

        const result = await getAchievementsForUser('patient-1');

        expect(result.map(achievement => achievement.obtained)).toEqual([true, true, false]);
        expect(result[0].progress).toEqual({ current: 1, target: 1 });
        expect(Turno.countDocuments).toHaveBeenCalledWith({
            usuarioId: 'patient-1',
            estado: { $nin: ['Cancelado', 'cancelado', 'CANCELADO', 'cancelled', 'CANCELLED'] },
            sagaStatus: { $ne: 'COMPENSATED' }
        });
        expect(Medicamento.countDocuments).toHaveBeenCalledWith({ usuarioId: 'patient-1' });
        expect(Estudio.countDocuments).toHaveBeenCalledWith({ usuarioId: 'patient-1' });
    });

    it('does not hide database connection failures', async () => {
        connectDatabase.mockRejectedValue(new Error('database unavailable'));

        await expect(getAchievementsForUser('patient-1')).rejects.toThrow('database unavailable');
        expect(Turno.countDocuments).not.toHaveBeenCalled();
    });
});
