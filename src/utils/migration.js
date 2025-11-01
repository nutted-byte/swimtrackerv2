import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'swim_tracker_sessions';
const MIGRATION_FLAG_KEY = 'swim_tracker_migrated';

/**
 * Check if localStorage has data that needs to be migrated
 */
export const hasLocalStorageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const migrated = localStorage.getItem(MIGRATION_FLAG_KEY);
    return data && JSON.parse(data).length > 0 && !migrated;
  } catch (error) {
    console.error('Error checking localStorage data:', error);
    return false;
  }
};

/**
 * Convert camelCase field names to snake_case for Supabase
 */
const convertToSnakeCase = (session) => {
  const snakeCaseSession = {};

  for (const [key, value] of Object.entries(session)) {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    snakeCaseSession[snakeKey] = value;
  }

  return snakeCaseSession;
};

/**
 * Migrate localStorage data to Supabase
 */
export const migrateLocalStorageToSupabase = async (userId) => {
  try {
    // Check if already migrated
    if (localStorage.getItem(MIGRATION_FLAG_KEY)) {
      console.log('Data already migrated, skipping...');
      return { success: true, migrated: 0, message: 'Already migrated' };
    }

    // Get data from localStorage
    const localData = localStorage.getItem(STORAGE_KEY);
    if (!localData) {
      console.log('No localStorage data found to migrate');
      return { success: true, migrated: 0, message: 'No data to migrate' };
    }

    const sessions = JSON.parse(localData);
    if (sessions.length === 0) {
      console.log('No sessions to migrate');
      return { success: true, migrated: 0, message: 'No sessions to migrate' };
    }

    console.log(`Migrating ${sessions.length} sessions to Supabase...`);

    // Prepare sessions for Supabase (add user_id, remove old id, convert to snake_case)
    const sessionsToInsert = sessions.map(session => {
      const { id, ...sessionWithoutId } = session;
      const snakeCaseSession = convertToSnakeCase(sessionWithoutId);
      return {
        ...snakeCaseSession,
        user_id: userId,
      };
    });

    // Insert into Supabase in batches (Supabase has a limit)
    const batchSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < sessionsToInsert.length; i += batchSize) {
      const batch = sessionsToInsert.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('swim_sessions')
        .insert(batch)
        .select();

      if (error) {
        console.error('Error inserting batch:', error);
        throw error;
      }

      totalInserted += data.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${data.length} sessions`);
    }

    // Mark as migrated
    localStorage.setItem(MIGRATION_FLAG_KEY, 'true');

    console.log(`✅ Successfully migrated ${totalInserted} sessions to Supabase`);

    return {
      success: true,
      migrated: totalInserted,
      message: `Successfully migrated ${totalInserted} sessions`,
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      migrated: 0,
      message: `Migration failed: ${error.message}`,
      error,
    };
  }
};

/**
 * Clear localStorage data after successful migration
 * (Optional - keeps a backup in localStorage)
 */
export const clearLocalStorageData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Cleared localStorage data');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Reset migration flag (for testing)
 */
export const resetMigrationFlag = () => {
  localStorage.removeItem(MIGRATION_FLAG_KEY);
  console.log('Migration flag reset');
};
