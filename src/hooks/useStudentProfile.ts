import { useState, useEffect } from 'react';
import { StudentProfileAPI } from '../services/studentProfileApi';
import type { StudentProfileResponse } from '../services/studentProfileApi';

interface UseStudentProfileResult {
    data: StudentProfileResponse | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

/**
 * Custom hook to fetch and manage student profile data
 * @param studentId - The student's ID
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useStudentProfile(studentId: number | null): UseStudentProfileResult {
    const [data, setData] = useState<StudentProfileResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProfile = async () => {
        if (!studentId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const profileData = await StudentProfileAPI.getStudentProfile(studentId);
            setData(profileData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch student profile'));
            console.error('Error in useStudentProfile:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [studentId]);

    return {
        data,
        loading,
        error,
        refetch: fetchProfile
    };
}
