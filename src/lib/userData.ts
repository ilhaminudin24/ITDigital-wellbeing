// ITDigital Wellbeing Monitor - User Data Service
// Manages user profile, activities, and calorie calculations using localStorage

// ============================================================================
// INTERFACES
// ============================================================================

export interface User {
    id: string;
    email: string;
    name: string;
    weight: number;      // kg
    height: number;      // cm
    age: number;
    gender: 'male' | 'female';
    targetCalories: number;
    totalCalories: number;
    profileCompleted: boolean;
}

export interface Activity {
    id: string;
    date: string;        // ISO date string (YYYY-MM-DD)
    location: string;    // Exercise location (single field)
    distance: number;    // Distance in km
    calories: number;
    photo: string;       // base64 encoded
    createdAt: string;   // ISO datetime string
}

// ============================================================================
// CONSTANTS
// ============================================================================

const USER_STORAGE_KEY = 'wellbeing-user';
const ACTIVITIES_STORAGE_KEY = 'wellbeing-activities';

// Tooltip explanation for the BMR formula - displayed in UI
export const TARGET_FORMULA_TOOLTIP = `Target kalori dihitung berdasarkan:
• BMR (Basal Metabolic Rate) - kalori dasar tubuh
• × 15% = Target mingguan
• × 52 minggu = Target tahunan`;

/**
 * Calculate estimated walking time to burn calories based on weight
 * Walking burns approximately: weight (kg) × 0.035 × minutes (for walking speed ~4km/h)
 * More accurate: MET value 3.5 × weight × duration(hours) = calories
 * Simplified: ~0.05 cal/kg/min for moderate walking
 * @param calories - Target calories to burn
 * @param weight - Body weight in kg
 * @returns Object with estimated walking times
 */
export function calculateWalkingTime(calories: number, weight: number): {
    singleSessionMinutes: number;
    shortSessionMinutes: number;
    shortSessionCount: number;
} {
    // Calories per minute walking ≈ 0.05 × weight (for ~4-5 km/h pace)
    const calPerMinute = 0.05 * weight;

    // Total minutes needed per week
    const totalMinutes = Math.round(calories / calPerMinute);

    // Single session option
    const singleSessionMinutes = totalMinutes;

    // Multiple short sessions option (divide into 2-3 sessions)
    const shortSessionCount = totalMinutes > 30 ? 3 : 2;
    const shortSessionMinutes = Math.round(totalMinutes / shortSessionCount);

    return {
        singleSessionMinutes,
        shortSessionMinutes,
        shortSessionCount,
    };
}

/**
 * Generate dynamic motivation text based on user's weekly target and weight
 * @param weeklyTarget - Weekly calorie target
 * @param weight - Body weight in kg
 * @returns Motivation text string
 */
export function getMotivationText(weeklyTarget: number, weight: number): string {
    const walkTime = calculateWalkingTime(weeklyTarget, weight);

    return `Hanya butuh ~1 kali jalan ${walkTime.singleSessionMinutes} menit per minggu, ATAU ${walkTime.shortSessionCount} kali jalan pendek ${walkTime.shortSessionMinutes} menit!`;
}

// ============================================================================
// BMR & TARGET CALCULATION
// ============================================================================

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
 * @param weight - Body weight in kg
 * @param height - Height in cm
 * @param age - Age in years
 * @param gender - 'male' or 'female'
 * @returns BMR in calories/day
 */
export function calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female'
): number {
    // Mifflin-St Jeor Equation
    // Male: 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
    // Female: 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    }
    return 10 * weight + 6.25 * height - 5 * age - 161;
}

/**
 * Calculate weekly calorie target based on BMR
 * Formula: BMR × 15%
 * @param bmr - Basal Metabolic Rate
 * @returns Weekly calorie target
 */
export function calculateWeeklyTarget(bmr: number): number {
    return Math.round(bmr * 0.15);
}

/**
 * Calculate yearly calorie target based on BMR
 * Formula: BMR × 15% × 52 weeks
 * @param bmr - Basal Metabolic Rate
 * @returns Yearly calorie target
 */
export function calculateYearlyTarget(bmr: number): number {
    const weeklyTarget = calculateWeeklyTarget(bmr);
    return weeklyTarget * 52;
}

/**
 * Calculate monthly calorie target
 * @param yearlyTarget - Yearly calorie target
 * @returns Monthly calorie target
 */
export function calculateMonthlyTarget(yearlyTarget: number): number {
    return Math.round(yearlyTarget / 12);
}

// ============================================================================
// USER CRUD OPERATIONS
// ============================================================================

/**
 * Get current user from localStorage
 * @returns User object or null if not found
 */
export function getUser(): User | null {
    if (typeof window === 'undefined') return null;

    const data = localStorage.getItem(USER_STORAGE_KEY);
    if (!data) return null;

    try {
        return JSON.parse(data) as User;
    } catch {
        return null;
    }
}

/**
 * Save user to localStorage
 * @param user - User object to save
 */
export function saveUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

/**
 * Create a new user with profile data and calculated target
 * @param data - Partial user data (name, email, weight, height, age, gender)
 * @returns Created user object
 */
export function createUser(data: {
    name: string;
    email: string;
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female';
}): User {
    const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
    const targetCalories = calculateYearlyTarget(bmr);

    const user: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        weight: data.weight,
        height: data.height,
        age: data.age,
        gender: data.gender,
        targetCalories,
        totalCalories: 0,
        profileCompleted: true,
    };

    saveUser(user);
    return user;
}

/**
 * Update user profile fields and optionally recalculate target
 * @param fields - Fields to update
 * @param recalculateTarget - Whether to recalculate target calories
 * @returns Updated user or null if user not found
 */
export function updateUserProfile(
    fields: Partial<Pick<User, 'name' | 'weight' | 'height' | 'age' | 'gender'>>,
    recalculateTarget: boolean = true
): User | null {
    const user = getUser();
    if (!user) return null;

    const updatedUser: User = { ...user, ...fields };

    if (recalculateTarget) {
        const bmr = calculateBMR(
            updatedUser.weight,
            updatedUser.height,
            updatedUser.age,
            updatedUser.gender
        );
        updatedUser.targetCalories = calculateYearlyTarget(bmr);
    }

    saveUser(updatedUser);
    return updatedUser;
}

/**
 * Update user's total calories (internal use)
 * @param totalCalories - New total calories value
 */
function updateUserTotalCalories(totalCalories: number): void {
    const user = getUser();
    if (!user) return;

    user.totalCalories = totalCalories;
    saveUser(user);
}

/**
 * Clear user data (logout)
 */
export function clearUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_STORAGE_KEY);
}

// ============================================================================
// ACTIVITY CRUD OPERATIONS
// ============================================================================

/**
 * Get all activities from localStorage
 * @returns Array of activities sorted by date (newest first)
 */
export function getActivities(): Activity[] {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (!data) return [];

    try {
        const activities = JSON.parse(data) as Activity[];
        return activities.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } catch {
        return [];
    }
}

/**
 * Save activities array to localStorage
 * @param activities - Array of activities to save
 */
function saveActivities(activities: Activity[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
}

/**
 * Add a new activity and update user's total calories
 * @param data - Activity data (without id and createdAt)
 * @returns Created activity object
 */
export function addActivity(data: {
    date: string;
    location: string;
    distance: number;
    calories: number;
    photo: string;
}): Activity {
    const activities = getActivities();

    const activity: Activity = {
        id: `act-${Date.now()}`,
        date: data.date,
        location: data.location,
        distance: data.distance,
        calories: data.calories,
        photo: data.photo,
        createdAt: new Date().toISOString(),
    };

    activities.unshift(activity);
    saveActivities(activities);

    // Update user's total calories
    const user = getUser();
    if (user) {
        updateUserTotalCalories(user.totalCalories + data.calories);
    }

    return activity;
}

/**
 * Get activities for a specific month
 * @param month - Month (0-11)
 * @param year - Year
 * @returns Array of activities for the specified month
 */
export function getActivitiesByMonth(month: number, year: number): Activity[] {
    const activities = getActivities();

    return activities.filter(activity => {
        const actDate = new Date(activity.date);
        return actDate.getMonth() === month && actDate.getFullYear() === year;
    });
}

/**
 * Get total calories for a specific month
 * @param month - Month (0-11)
 * @param year - Year
 * @returns Total calories for the month
 */
export function getMonthlyCalories(month: number, year: number): number {
    const monthActivities = getActivitiesByMonth(month, year);
    return monthActivities.reduce((sum, act) => sum + act.calories, 0);
}

/**
 * Get calories grouped by month for a year
 * @param year - Year
 * @returns Array of 12 numbers representing calories per month (Jan-Dec)
 */
export function getYearlyCaloriesByMonth(year: number): number[] {
    const result: number[] = [];
    for (let month = 0; month < 12; month++) {
        result.push(getMonthlyCalories(month, year));
    }
    return result;
}

/**
 * Clear all activities (for testing/reset)
 */
export function clearActivities(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACTIVITIES_STORAGE_KEY);
}

// ============================================================================
// MOCK DATA INITIALIZATION (for development)
// ============================================================================

/**
 * Initialize mock data for development/demo purposes
 */
export function initializeMockData(): void {
    // Check if data already exists
    if (getUser()) return;

    // Create mock user
    const mockUser: User = {
        id: 'user-001',
        email: 'ilham@ikea.com',
        name: 'Ilham',
        weight: 70,
        height: 170,
        age: 30,
        gender: 'male',
        targetCalories: 133106, // Calculated from BMR
        totalCalories: 57375,
        profileCompleted: true,
    };
    saveUser(mockUser);

    // Create mock activities
    const mockActivities: Activity[] = [
        {
            id: 'act-001',
            date: '2026-01-15',
            location: 'BSD Green Office Park',
            distance: 2.5,
            calories: 350,
            photo: '',
            createdAt: '2026-01-15T08:30:00.000Z',
        },
        {
            id: 'act-002',
            date: '2026-01-12',
            location: 'AEON Mall BSD City',
            distance: 3.2,
            calories: 420,
            photo: '',
            createdAt: '2026-01-12T07:45:00.000Z',
        },
        {
            id: 'act-003',
            date: '2026-01-10',
            location: 'The Breeze BSD',
            distance: 1.5,
            calories: 180,
            photo: '',
            createdAt: '2026-01-10T12:15:00.000Z',
        },
        {
            id: 'act-004',
            date: '2026-01-05',
            location: 'IKEA Alam Sutera',
            distance: 1.2,
            calories: 150,
            photo: '',
            createdAt: '2026-01-05T07:30:00.000Z',
        },
        {
            id: 'act-005',
            date: '2025-12-28',
            location: 'Scientia Square Park',
            distance: 4.0,
            calories: 520,
            photo: '',
            createdAt: '2025-12-28T06:00:00.000Z',
        },
        {
            id: 'act-006',
            date: '2025-12-20',
            location: 'Living World Alam Sutera',
            distance: 2.8,
            calories: 380,
            photo: '',
            createdAt: '2025-12-20T17:30:00.000Z',
        },
    ];
    saveActivities(mockActivities);
}
