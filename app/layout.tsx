import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ChatbotWrapper from "@/components/layout/ChatbotWrapper";
import "./globals.css";
import "./landing.css";

export async function generateMetadata(): Promise<Metadata> {
  let title = "PluginTekCMS | Professional Website Solutions";
  let description = "High-performance content management and website creation solutions by PluginTekCMS.";

  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['site_name', 'site_description']);

    if (settings) {
      const siteName = settings.find(s => s.key === 'site_name')?.value;
      const siteDesc = settings.find(s => s.key === 'site_description')?.value;
      const favType = settings.find(s => s.key === 'favicon_type')?.value;
      const favUrl = settings.find(s => s.key === 'favicon_url')?.value;
      
      if (siteName) title = siteName;
      if (siteDesc) description = siteDesc;
      
      if (favType === 'image' && favUrl) {
        return {
          title,
          description,
          icons: {
            icon: favUrl,
            shortcut: favUrl,
            apple: favUrl,
          }
        };
      }
    }
  } catch (error) {
    console.error("Error loading metadata:", error);
  }

  return {
    title,
    description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let fontFamily = 'Outfit';
  let fontUrl = 'https://fonts.googleapis.com/css2?family=Caveat&family=Dancing+Script&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600;700&family=Pacifico&family=Playfair+Display&family=Cinzel:wght@400;700&family=Montserrat:wght@400;700&family=Roboto:wght@400;700&family=Manrope:wght@400;700&family=Poppins:wght@400;700&display=swap';
  let chatbotCode = '';

  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('value, key')
      .in('key', ['font_family', 'chatbot_code', 'site_spacing', 'site_primary_color', 'site_secondary_color']);

    const fontSetting = settings?.find(s => s.key === 'font_family');
    if (fontSetting?.value) {
      fontFamily = fontSetting.value;
      fontUrl = `https://fonts.googleapis.com/css2?family=Caveat&family=Dancing+Script&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=${fontFamily.replace(/ /g, '+')}:wght@300;400;500;600;700&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap`;
    }

    const spacingSetting = settings?.find(s => s.key === 'site_spacing');
    const spacingValue = spacingSetting?.value || 'spaced-out';
    const spacingMap: Record<string, string> = {
      'tight': '2rem',
      'normal': '4rem',
      'spaced-out': '7rem'
    };
    const sectionPadding = spacingMap[spacingValue] || '6rem';

    const chatbotSetting = settings?.find(s => s.key === 'chatbot_code');
    chatbotCode = chatbotSetting?.value || '';

    const primaryColor = settings?.find(s => s.key === 'site_primary_color')?.value || '#f59e0b';
    const secondaryColor = settings?.find(s => s.key === 'site_secondary_color')?.value || '#71717a';

    const favType = settings?.find(s => s.key === 'favicon_type')?.value || 'image';
    const favUrl = settings?.find(s => s.key === 'favicon_url')?.value || '';
    const favIcon = settings?.find(s => s.key === 'favicon_icon')?.value || 'fa-solid fa-star';
    const favColor = settings?.find(s => s.key === 'favicon_icon_color')?.value || '#f59e0b';

    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href={fontUrl} rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
          {favType === 'image' && favUrl && (
            <>
              <link rel="icon" href={favUrl} />
              <link rel="apple-touch-icon" href={favUrl} />
            </>
          )}
          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              --section-py: ${sectionPadding};
              --content-gap: ${spacingValue === 'tight' ? '1.5rem' : spacingValue === 'normal' ? '2.5rem' : '4rem'};
              --hero-padding: ${spacingValue === 'tight' ? '4rem' : '6rem'};
              --primary: ${primaryColor};
              --secondary: ${secondaryColor};
            }
          `}} />
          {favType === 'icon' && (
            <script dangerouslySetInnerHTML={{ __html: `
              (function() {
                try {
                  const iconClass = "${favIcon}";
                  const color = "${favColor}";
                  
                  // Create a temporary element to get the icon's character
                  const i = document.createElement('i');
                  i.className = iconClass;
                  i.style.position = 'absolute';
                  i.style.left = '-9999px';
                  i.style.visibility = 'hidden';
                  document.body.appendChild(i);
                  
                  // Wait for FA to load, then draw to canvas
                  const updateFavicon = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 64;
                    canvas.height = 64;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    
                    const computedStyle = window.getComputedStyle(i);
                    const fontFamily = computedStyle.fontFamily;
                    const content = window.getComputedStyle(i, ':before').content.replace(/['"]/g, '');
                    
                    if (content && content !== 'none') {
                      ctx.fillStyle = color;
                      ctx.font = '900 48px ' + fontFamily;
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';
                      ctx.fillText(content, 32, 32);
                      
                      let link = document.querySelector("link[rel~='icon']");
                      if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.head.appendChild(link);
                      }
                      link.href = canvas.toDataURL('image/png');
                      
                      let appleLink = document.querySelector("link[rel='apple-touch-icon']");
                      if (!appleLink) {
                        appleLink = document.createElement('link');
                        appleLink.rel = 'apple-touch-icon';
                        document.head.appendChild(appleLink);
                      }
                      appleLink.href = canvas.toDataURL('image/png');
                      
                      document.body.removeChild(i);
                    } else {
                      // Retry if FA hasn't loaded character yet
                      setTimeout(updateFavicon, 100);
                    }
                  };
                  
                  if (document.body) updateFavicon();
                  else window.addEventListener('DOMContentLoaded', updateFavicon);
                } catch(e) { console.error('Favicon error:', e); }
              })();
            `}} />
          )}
          <script dangerouslySetInnerHTML={{ __html: `
            console.log("🎨 Site Spacing Active: ${spacingValue} (${sectionPadding} padding)");
          `}} />
        </head>
        <body 
          className="antialiased" 
          style={{ 
            fontFamily: `'${fontFamily}', sans-serif`
          } as React.CSSProperties}
        >
          {children}
          <ChatbotWrapper chatbotCode={chatbotCode} />
        </body>
      </html>
    );
  } catch (error) {
    console.error("Settings loading error:", error);
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href={fontUrl} rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </head>
        <body className="antialiased" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
          {children}
          <ChatbotWrapper chatbotCode={chatbotCode} />
        </body>
      </html>
    );
  }
}

