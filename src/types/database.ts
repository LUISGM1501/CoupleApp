// Tipos que reflejan el esquema SQL. Si cambia el SQL, cambia aquí.

export type MoodKey =
  | 'enamorado'
  | 'feliz'
  | 'tranquilo'
  | 'extrano'
  | 'horny'
  | 'ocupado'
  | 'cansado'
  | 'pensativo'

export interface Profile {
  id: string
  email: string
  display_name: string
  photo_url: string | null
  couple_id: string | null
  couple_code: string | null
  mood: MoodKey | null
  mood_message: string | null
  mood_updated_at: string | null
  created_at: string
}

export interface Couple {
  id: string
  user1_id: string
  user2_id: string | null
  user1_name: string
  user2_name: string
  start_date: string
  couple_code: string
  created_at: string
}

export interface Memory {
  id: string
  couple_id: string
  created_by: string
  title: string
  description: string | null
  location: string | null
  date: string
  photos: string[]
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  memory_id: string
  author_id: string
  author_name: string
  author_photo_url: string | null
  text: string
  created_at: string
}
