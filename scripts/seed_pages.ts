import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedPages() {
  console.log('Fetching existing services...');
  const { data: services, error: fetchError } = await supabase.from('services').select('*');

  if (fetchError) {
    console.error('Error fetching services:', fetchError);
    return;
  }

  if (!services || services.length === 0) {
    console.log('No services found to seed.');
    return;
  }

  console.log(`Found ${services.length} services. Seeding pages...`);

  for (const service of services) {
    // Generate slug from title
    const slug = service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Create attractive HTML content
    const htmlContent = `
      <div class="space-y-6">
        <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          ${service.description}
        </p>
        
        <div class="h-px bg-gray-200 dark:bg-zinc-800 my-8"></div>
        
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Comprehensive Care for ${service.title}</h2>
        <p class="text-gray-600 dark:text-gray-400 leading-loose">
          Our dedicated medical professionals provide highly specialized, patient-centered care for <strong>${service.title}</strong>. We believe in holistic treatments designed to restore your health and improve your overall well-being. Using the latest medical advancements and evidence-based protocols, our personalized treatment plans are tailored to meet your unique health needs and ensure the best possible outcomes.
        </p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div class="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
                <h3 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">Expert Specialists</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Highly qualified experts with years of clinical experience.</p>
            </div>
            <div class="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
                <h3 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">Advanced Treatments</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Utilizing state-of-the-art medical technology and therapies.</p>
            </div>
        </div>
        
        <div class="mt-10 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 text-center">
            <h3 class="text-xl font-bold text-amber-900 dark:text-amber-500 mb-2">Ready to book a consultation?</h3>
            <p class="text-amber-700 dark:text-amber-600 mb-4">Contact us today to discuss your requirements.</p>
            <a href="/#contact" class="inline-block bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors">Get Started</a>
        </div>
      </div>
    `;

    // Try to insert page
    const { data: insertedPage, error: insertError } = await supabase
      .from('pages')
      .upsert({
        title: service.title,
        slug: slug,
        content: htmlContent,
        image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80', // Default placeholder beautiful image
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (insertError) {
      console.error(`Failed to insert page for ${service.title}:`, insertError);
      continue;
    }

    // Link page to service
    const pageUrl = `/p/${slug}`;
    const { error: updateError } = await supabase
      .from('services')
      .update({ page_url: pageUrl })
      .eq('id', service.id);

    if (updateError) {
      console.error(`Failed to update service ${service.title} with page_url:`, updateError);
    } else {
      console.log(`Successfully generated and linked page for: ${service.title}`);
    }
  }

  console.log('Seeding complete!');
}

seedPages();
