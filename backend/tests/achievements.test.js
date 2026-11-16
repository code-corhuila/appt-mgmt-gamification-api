const jwt = require('jsonwebtoken');
const request = require('supertest');

const originalAuthServiceUrl = process.env.AUTH_SERVICE_URL;
const originalServiceToken = process.env.SERVICE_TOKEN;
const originalFetch = global.fetch;
process.env.AUTH_SERVICE_URL = 'http://auth-service.test';
process.env.SERVICE_TOKEN = 'test-service-token';

jest.mock('../services/achievementService', () => ({
    getAchievementsForUser: jest.fn()
}));

const { getAchievementsForUser } = require('../services/achievementService');
const app = require('../services/gamification-service/server');

const secret = process.env.JWT_SECRET || 'SaludActiva_Secret_Key_2024';
const token = jwt.sign({ userId: 'patient-1' }, secret);

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    if (originalAuthServiceUrl === undefined) delete process.env.AUTH_SERVICE_URL;
    else process.env.AUTH_SERVICE_URL = originalAuthServiceUrl;
    if (originalServiceToken === undefined) delete process.env.SERVICE_TOKEN;
    else process.env.SERVICE_TOKEN = originalServiceToken;
    global.fetch = originalFetch;
});

describe('GET /api/achievements', () => {
    it('reports liveness and waits for its source databases before becoming ready', async () => {
        const liveness = await request(app).get('/health/live');
        const readiness = await request(app).get('/health/ready');

        expect(liveness.status).toBe(200);
        expect(liveness.body.status).toBe('alive');
        expect(readiness.status).toBe(503);
        expect(readiness.body.status).toBe('degraded');
        expect(Object.keys(readiness.body.database)).toEqual([
            'turnos',
            'medicamentos',
            'estudios'
        ]);
    });

    it('requires an authenticated user', async () => {
        const response = await request(app).get('/api/achievements');

        expect(response.status).toBe(401);
        expect(getAchievementsForUser).not.toHaveBeenCalled();
    });

    it('rejects invalid bearer tokens', async () => {
        const response = await request(app)
            .get('/api/achievements')
            .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(403);
        expect(getAchievementsForUser).not.toHaveBeenCalled();
    });

    it('returns the authenticated user achievements', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ id: 'patient-1', email: 'patient@example.test' })
        });
        const achievements = [{
            id: 'first-appointment',
            title: 'Primer turno',
            description: 'Registra tu primer turno médico.',
            obtained: true,
            progress: { current: 1, target: 1 }
        }];
        getAchievementsForUser.mockResolvedValue(achievements);

        const response = await request(app)
            .get('/api/achievements')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ achievements });
        expect(getAchievementsForUser).toHaveBeenCalledWith('patient-1');
    });

    it('reports the gamification data store as unavailable on lookup failure', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ id: 'patient-1', email: 'patient@example.test' })
        });
        getAchievementsForUser.mockRejectedValue(new Error('database unavailable'));

        const response = await request(app)
            .get('/api/achievements')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(503);
        expect(response.body).toEqual({ mensaje: 'No fue posible consultar los logros' });
    });
});
