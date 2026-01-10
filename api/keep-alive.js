import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const SUPABASE_URL = 'https://pwrixdojbrmtwyfmygys.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3cml4ZG9qYnJtdHd5Zm15Z3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MTkyNTQsImV4cCI6MjA4MjE5NTI1NH0.xR7kmjDRiECOu7usPyzNKcg-dtIQCRNdnuI49Sl799U';

export default async function handler(req, res) {
    try {
        // Crear cliente de Supabase
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Realizar una consulta simple para mantener la base de datos activa
        const { data, error, count } = await supabase
            .from('guest_passes')
            .select('id', { count: 'exact', head: true });

        if (error) {
            console.error('Error en consulta Supabase:', error);
            return res.status(500).json({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }

        // Log exitoso
        console.log(`✅ Keep-alive exitoso - ${count} invitaciones en DB`);

        return res.status(200).json({
            success: true,
            message: '✅ Ping keep-alive de Supabase exitoso',
            passesCount: count,
            timestamp: new Date().toISOString(),
            nextPingRecommended: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
        });

    } catch (error) {
        console.error('Error general:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
