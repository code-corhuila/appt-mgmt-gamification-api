require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const achievementsRoutes = require('../../routes/achievements');
const { connectDatabase, closeDatabase, getDatabaseStatus } = require('../../config/dbConnections');

const app = express();
const port = Number(process.env.GAMIFICATION_PORT || 3003);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use('/api/achievements', achievementsRoutes);

app.get('/health/live', (req, res) => res.json({ status: 'alive' }));

app.get('/health/ready', (req, res) => {
    const domains = getDatabaseStatus().domains;
    const requiredDomains = ['turnos', 'medicamentos', 'estudios'];
    const database = Object.fromEntries(
        requiredDomains.map(domain => [domain, domains[domain]])
    );
    const ready = requiredDomains.every(domain => database[domain].status === 'connected');

    return res.status(ready ? 200 : 503).json({
        status: ready ? 'ready' : 'degraded',
        database
    });
});

async function start() {
    connectDatabase().catch(error => {
        console.error('Gamification MongoDB unavailable; API remains live but not ready:', error.message);
    });

    const server = app.listen(port, '0.0.0.0', () => {
        console.log(`Gamification service listening on ${port}`);
    });

    const shutdown = signal => {
        console.log(`Gamification service received ${signal}`);
        server.close(error => {
            if (error) {
                console.error('Gamification HTTP shutdown failed:', error.message);
                process.exitCode = 1;
            }
            closeDatabase().catch(closeError => {
                console.error('Gamification MongoDB shutdown failed:', closeError.message);
                process.exitCode = 1;
            });
        });
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
}

if (require.main === module) {
    start().catch(error => {
        console.error('Gamification service startup failed:', error.message);
        process.exitCode = 1;
    });
}

module.exports = app;
