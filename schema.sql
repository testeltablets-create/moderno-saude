-- SQL para configurar o banco de dados do Moderno Saúde
-- Execute isso no SQL Editor do seu painel Supabase

-- 1. Tabela de Perfis (Dentistas, Médicos, Psicólogos, etc.)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  professional_type TEXT CHECK (professional_type IN ('dentista', 'medico', 'psicologo', 'fisioterapeuta', 'outros')),
  specialty TEXT,
  registry_number TEXT, -- CRM, CRO, CRP, etc.
  location_city TEXT,
  location_neighborhood TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0
);

-- 2. Tabela de Agendamentos (Appointments)
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id UUID REFERENCES auth.users,
  professional_id UUID REFERENCES profiles(id),
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show')) DEFAULT 'pending',
  origin TEXT DEFAULT 'marketplace'
);

-- 3. Tabela de Slots de Disponibilidade
CREATE TABLE availability_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES profiles(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_locked BOOLEAN DEFAULT FALSE,
  locked_until TIMESTAMP WITH TIME ZONE
);

-- 4. Tabela de Avaliações (Reviews)
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID REFERENCES auth.users,
  professional_id UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE
);

-- 5. Row Level Security (RLS) - Exemplos básicos
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Perfis públicos são visíveis para todos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem editar seus próprios perfis" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pacientes veem seus próprios agendamentos" ON appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Profissionais veem seus agendamentos recebidos" ON appointments FOR SELECT USING (auth.uid() = professional_id);

-- Encerramento
COMMENT ON TABLE profiles IS 'Informações de profissionais e pacientes.';
