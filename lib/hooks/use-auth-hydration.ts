import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

/**
 * Hook to ensure Zustand store has hydrated before rendering auth-dependent UI
 * Prevents hydration mismatches between server and client
 */
export function useAuthHydration() {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Wait for Zustand persist to rehydrate
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
            setIsHydrated(true);
        });

        // Check if already hydrated
        const state = useAuthStore.getState();
        if (state.hasHydrated) {
            setIsHydrated(true);
        }

        return unsubscribe;
    }, []);

    return isHydrated;
}
