import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { seedData } from '../utils/seed_data'

// Manually load environment variables from .env.local
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local')
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8')
            content.split('\n').forEach(line => {
                const parts = line.split('=')
                if (parts.length >= 2) {
                    const key = parts[0].trim()
                    const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '')
                    process.env[key] = value
                }
            })
        }
    } catch (e) {
        console.error("Error loading .env.local:", e)
    }
}

async function runSeed() {
    loadEnv()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase environment variables")
        process.exit(1)
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log("Starting seeding process via CLI...")

    try {
        // 1. Seed Site Settings
        console.log("Seeding Site Settings...")
        const { error: settingsError } = await supabase
            .from('site_settings')
            .upsert(seedData.site_settings)
        if (settingsError) throw settingsError

        // 2. Seed Services
        console.log("Seeding Services...")
        await supabase.from('services').delete().neq('id', -1)
        const { error: servicesError } = await supabase
            .from('services')
            .insert(seedData.services)
        if (servicesError) throw servicesError

        // 3. Seed Projects
        console.log("Seeding Projects...")
        await supabase.from('projects').delete().neq('id', -1)
        for (const project of seedData.projects) {
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .insert({
                    title: project.title,
                    location: project.location,
                    thumbnail_url: project.thumbnail_url
                })
                .select()
                .single()
            if (projectError) throw projectError
        }

        console.log("Database successfully seeded via CLI!")
    } catch (error: any) {
        console.error("Seeding Error:", error)
        process.exit(1)
    }
}

runSeed()
