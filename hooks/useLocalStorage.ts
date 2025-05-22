"use client";

export const useLocalStorage = <T>(key: string) => {
    const setItem = (value: T) => {
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error(`Error setting localStorage item "${key}":`, error);
        }
    };

    const getItem = (): T | undefined => {
        try {
            if (typeof window !== "undefined") {
                const item = localStorage.getItem(key);
                return item ? (JSON.parse(item) as T) : undefined;
            }
        } catch (error) {
            console.error(`Error getting localStorage item "${key}":`, error);
        }
    };

    return { setItem, getItem };
};