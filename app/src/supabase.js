import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://itksrszfrscjcmzkhryw.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0a3Nyc3pmcnNjamNtemtocnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTU0MzksImV4cCI6MjA1OTE5MTQzOX0.oMzQ6HbxS0W46Lk8IZ04ZVoMi80cWC_RkpRNflwYsyo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
