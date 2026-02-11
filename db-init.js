import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = 'https://cbblnzidhylzbiowqmdk.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiYmxuemlkaHlsemJpb3dxbWRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDgxMzA0MywiZXhwIjoyMDg2Mzg5MDQzfQ.K9ESVu5fu-HEAwgzaIlulWW6Zmm4j40agUDKul7dZhQ'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSql() {
  const sqlPath = path.join(__dirname, 'schema.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  console.log('Executando SQL no Supabase...')
  
  // O supabase-js não tem um método .rpc() ou .query() para DDL direto sem uma função Postgres definida.
  // Como não tenho a função 'exec_sql' definida ainda, vou avisar o usuário.
  console.log('Aviso: O SDK do Supabase requer uma função RPC para executar SQL arbitrário.')
  console.log('Tentando via REST API administrativa (se disponível)...')
  
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': supabaseServiceKey
    },
    body: JSON.stringify({ sql_query: sql })
  })

  if (response.ok) {
    console.log('SQL executado com sucesso!')
  } else {
    const error = await response.text()
    console.error('Erro ao executar SQL:', error)
    console.log('\n--- SCRIPT SQL PARA COPIAR ---')
    console.log(sql)
    console.log('--- FIM DO SCRIPT ---')
  }
}

runSql()
