import { useEffect, useRef } from 'react';
import { studyAPI } from '../services/api';

const StudyTimer = ({ isActive }) => {
    const intervalRef = useRef(null);
    const pendingTimeRef = useRef(0);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                pendingTimeRef.current += 1;

                // Every 60 seconds, send update
                if (pendingTimeRef.current >= 60) {
                    sendUpdate(60);
                    pendingTimeRef.current -= 60;
                }
            }, 1000);
        } else {
            // Optional: send remaining seconds when paused/stopped
            // But for simplicity/performance we might just drop <60s chunks
            // or we could send it here.

            // To be safe against spamming small updates (e.g. user toggles play/pause rapidly),
            // maybe we only send if > 30s?
            // For now, let's stick to 60s batches to match "streak" granularity.
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    const sendUpdate = async (duration) => {
        try {
            await studyAPI.trackTime(duration);
        } catch (error) {
            // Silent error
            console.warn("Failed to sync study time");
        }
    };

    return null;
};

export default StudyTimer;
