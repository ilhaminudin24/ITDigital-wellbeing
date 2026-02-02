-- ============================================================
-- VALIDATION & FIX: Recalculate Total Calories
-- ============================================================

-- 1. Recalculate total_calories for ALL users based on their activities
-- This fixes the issue where Mustofa Kamil (and potentially others) have 0 calories
-- despite having activities (likely due to activities added before profile creation)
UPDATE public.user_profiles up
SET total_calories = (
    SELECT COALESCE(SUM(calories), 0)
    FROM public.activities a
    WHERE a.user_id = up.user_id
);

-- ============================================================
-- PREVENTION: Trigger for New Profiles
-- ============================================================

-- 2. Create a trigger to automatically calculate calories when a new profile is inserted.
-- This handles the case where activities were created BEFORE the profile.

CREATE OR REPLACE FUNCTION public.calculate_calories_on_profile_creation()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Calculate total calories from existing activities for this user
    -- and set it on the NEW record
    NEW.total_calories := (
        SELECT COALESCE(SUM(calories), 0)
        FROM public.activities
        WHERE user_id = NEW.user_id
    );
    
    RETURN NEW;
END;
$$;

-- Drop trigger if exists to allow re-running this script
DROP TRIGGER IF EXISTS trigger_calculate_calories_on_profile_creation ON public.user_profiles;

-- Create the trigger
CREATE TRIGGER trigger_calculate_calories_on_profile_creation
    BEFORE INSERT ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_calories_on_profile_creation();

-- ============================================================
-- VERIFICATION
-- ============================================================
-- Run this query to verify the fix (optional)
/*
SELECT 
    name, 
    total_calories, 
    (SELECT COUNT(*) FROM public.activities WHERE user_id = user_profiles.user_id) as activity_count 
FROM 
    public.user_profiles 
ORDER BY 
    total_calories DESC;
*/
