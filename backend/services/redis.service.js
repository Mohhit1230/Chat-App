import Redis from 'ioredis';

// Create a mock Redis client for when Redis is not available
const createMockRedisClient = () => {
    const store = new Map();
    return {
        get: async (key) => store.get(key) || null,
        set: async (key, value, ...args) => {
            store.set(key, value);
            // Handle TTL if provided
            if (args[0] === 'EX' && args[1]) {
                setTimeout(() => store.delete(key), args[1] * 1000);
            }
            return 'OK';
        },
        del: async (key) => {
            store.delete(key);
            return 1;
        },
        on: () => { },
        isMock: true
    };
};

let redisClient;

// Only try to connect to Redis if credentials are provided
if (process.env.REDIS_HOST && process.env.REDIS_PORT && process.env.REDIS_PASSWORD) {
    try {
        redisClient = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
            maxRetriesPerRequest: 3,
            retryDelayOnFailover: 1000,
            lazyConnect: true,
            showFriendlyErrorStack: true,
        });

        // Handle connection errors gracefully
        redisClient.on('connect', () => {
            console.log('✅ Redis connected');
        });

        redisClient.on('error', (err) => {
            console.warn('⚠️ Redis connection error, using in-memory store:', err.message);
            // Fall back to mock client
            redisClient = createMockRedisClient();
        });

        // Try to connect
        redisClient.connect().catch((err) => {
            console.warn('⚠️ Redis connection failed, using in-memory store');
            redisClient = createMockRedisClient();
        });

    } catch (error) {
        console.warn('⚠️ Redis initialization failed, using in-memory store');
        redisClient = createMockRedisClient();
    }
} else {
    console.log('📦 No Redis configured, using in-memory store for tokens');
    redisClient = createMockRedisClient();
}

export default redisClient;