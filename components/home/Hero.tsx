import { createClient } from "@/utils/supabase/static";
import { getContrastColor } from "@/utils/contrast";

// Height map for hero section
const heightMap: Record<string, string> = {
    full: 'min-h-[calc(100vh-5rem)]',
    large: 'min-h-[80vh]',
    medium: 'min-h-[60vh]',
};

// Desktop height map for hero section
const desktopHeightMap: Record<string, string> = {
    full: 'md:min-h-[calc(100vh-5rem)]',
    large: 'md:min-h-[80vh]',
    medium: 'md:min-h-[60vh]',
};

// Text alignment map
const alignMap: Record<string, string> = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
};

export default async function Hero() {
    const supabase = createClient();
    const { data: settings } = await supabase.from('site_settings').select('*');

    const getSetting = (key: string) => settings?.find(s => s.key === key)?.value;

    // Content
    const heroTitle = getSetting('hero_title') || "Elevate your business with modern solutions";
    const heroSubtitle = getSetting('hero_subtitle') || "Your trusted partner for specialized consulting, technical expertise, and operational excellence.";
    const highlightText = getSetting('hero_highlight_text') || "transforming lives";
    const highlightItalic = getSetting('hero_highlight_italic') === 'true';
    const highlightFont = getSetting('hero_highlight_font') || 'inherit';
    const badgeText = getSetting('hero_badge_text') || "";
    const badgeColor = getSetting('hero_badge_color') || 'var(--primary)';
    const ctaPrimary = getSetting('hero_cta_primary') || "Get in Touch";
    const ctaSecondary = getSetting('hero_cta_secondary') || "View Projects";
    const ctaPrimaryLink = getSetting('hero_cta_primary_link') || "#contact";
    const ctaSecondaryLink = getSetting('hero_cta_secondary_link') || "#portfolio";
    const ctaPrimaryColor = getSetting('hero_cta_primary_color') || 'var(--primary)';
    const ctaSecondaryColor = getSetting('hero_cta_secondary_color') || '#71717a';

    // Layout
    const textAlign = getSetting('hero_text_align') || 'center';
    const heightKey = getSetting('hero_height') || 'full';
    const heightKeyDesktop = getSetting('hero_height_desktop') || heightKey;
    const highlightColor = getSetting('hero_highlight_color') || 'var(--primary)';
    const ctaBorderRadius = getSetting('hero_cta_border_radius') || 'full';
    const heroTextColorMode = getSetting('hero_text_color_mode') || 'auto';
    const heroCustomTextColor = getSetting('hero_text_color') || '#ffffff';
    const heroTitleSize = getSetting('hero_title_size') || 'base';
    const cutoutImageUrl = getSetting('hero_cutout_image_url') || '';
    const cutoutPosition = getSetting('hero_cutout_position') || 'right';

    // Overlay Card Settings
    const overlayCardShow = getSetting('hero_overlay_card_show') === 'true';
    const overlayCardIcon = getSetting('hero_overlay_card_icon') || 'fa-solid fa-certificate';
    const overlayCardTitle = getSetting('hero_overlay_card_title') || 'SPECIALIST';
    const overlayCardText = getSetting('hero_overlay_card_text') || 'Expert solutions for your property needs.';
    const overlayCardPos = getSetting('hero_overlay_card_position') || 'bottom-left';

    // Position map for overlay card
    const overlayPosMap: Record<string, string> = {
        'bottom-left': 'bottom-12 left-10 sm:bottom-16 sm:left-24',
        'bottom-right': 'bottom-12 right-10 sm:bottom-16 sm:right-24',
        'top-left': 'top-12 left-10 sm:top-16 sm:left-24',
        'top-right': 'top-12 right-10 sm:top-16 sm:right-24',
    };
    const overlayPosClass = overlayPosMap[overlayCardPos] || overlayPosMap['bottom-left'];

    // Cutout Size Mapping
    const cutoutSize = getSetting('hero_cutout_size') || 'large';
    const cutoutSizeMap: Record<string, { maxW: string, maxH: string, flex: string }> = {
        small: { maxW: 'max-w-sm', maxH: '50vh', flex: 'flex-1' },
        medium: { maxW: 'max-w-md', maxH: '65vh', flex: 'flex-1' },
        base: { maxW: 'max-w-lg', maxH: '70vh', flex: 'flex-1' },
        large: { maxW: 'max-w-xl', maxH: '80vh', flex: 'flex-[1.1]' },
        xl: { maxW: 'max-w-2xl', maxH: '85vh', flex: 'flex-[1.3]' },
    };
    const currentSize = cutoutSizeMap[cutoutSize] || cutoutSizeMap['large'];

    // Background
    const bgType = getSetting('hero_bg_type') || 'image';
    const bgImageUrl = getSetting('hero_bg_image_url') || '';
    const bgImageScroll = getSetting('hero_bg_image_scroll') === 'true';
    const overlayOpacity = getSetting('hero_overlay_opacity') ?? 60;
    const bgColorStart = getSetting('hero_bg_color_start') || '#1a1a2e';
    const bgColorEnd = getSetting('hero_bg_color_end') || '#16213e';
    const bgVideoUrl = getSetting('hero_bg_video_url') || '';

    // Overlay Gradient Settings
    const overlayColorStart = getSetting('hero_overlay_color_start') || '#000000';
    const overlayColorEnd = getSetting('hero_overlay_color_end') || '#000000';
    const overlayOpacityStart = getSetting('hero_overlay_opacity_start') ?? overlayOpacity;
    const overlayOpacityEnd = getSetting('hero_overlay_opacity_end') ?? overlayOpacity;
    const overlayAngle = getSetting('hero_overlay_gradient_angle') || '180';

    // Derive background style
    let sectionStyle: React.CSSProperties = {};
    let overlayStyle: React.CSSProperties = {};

    // Helper to convert hex to rgba
    const hexToRgba = (hex: string, opacity: number) => {
        // Remove # if present
        const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
        const r = parseInt(cleanHex.slice(0, 2), 16) || 0;
        const g = parseInt(cleanHex.slice(2, 4), 16) || 0;
        const b = parseInt(cleanHex.slice(4, 6), 16) || 0;
        return `rgba(${r}, ${g}, ${b}, ${(Number(opacity) / 100).toFixed(2)})`;
    };

    const rgbaStart = hexToRgba(overlayColorStart, Number(overlayOpacityStart));
    const rgbaEnd = hexToRgba(overlayColorEnd, Number(overlayOpacityEnd));

    let primaryBgColor = '#000000'; // Default dark
    if (bgType === 'solid' || bgType === 'gradient') {
        primaryBgColor = bgColorStart;
    } else if (bgType === 'image' || bgType === 'video') {
        // If the overlay opacity is extremely low, this might not be accurate,
        // but typically users will increase overlay to improve contrast or just rely on image/video.
        primaryBgColor = overlayColorStart;
    }

    // Check if the primary background is light
    const isLightBg = getContrastColor(primaryBgColor) === 'black' && Number(overlayOpacityStart) > 20;

    const textColorClass = isLightBg ? 'text-gray-900' : 'text-white';
    const subtitleColorClass = isLightBg ? 'text-gray-800' : 'text-gray-100';
    const titleShadowClass = isLightBg ? 'drop-shadow-sm' : 'drop-shadow-lg';
    const subtitleShadowClass = isLightBg ? 'drop-shadow-sm' : 'drop-shadow-md';

    let titleStyle: React.CSSProperties = {};
    if (heroTextColorMode === 'custom') {
        titleStyle.color = heroCustomTextColor;
    }

    if (bgType === 'image') {
        const finalBgUrl = bgImageUrl || '/placeholder.jpg';
        sectionStyle = {
            backgroundImage: `url('${finalBgUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            ...(bgImageScroll && {
                animation: 'scrollBackground 60s linear infinite',
                backgroundRepeat: 'repeat-x',
                backgroundSize: 'auto 100%' // Required for the scrolling animation to loop correctly
            })
        };
        overlayStyle = {
            background: `linear-gradient(${overlayAngle}deg, ${rgbaStart}, ${rgbaEnd})`,
        };
    } else if (bgType === 'gradient') {
        sectionStyle = {
            background: `linear-gradient(135deg, ${bgColorStart}, ${bgColorEnd})`,
        };
    } else if (bgType === 'solid') {
        sectionStyle = { backgroundColor: bgColorStart };
    } else if (bgType === 'video') {
        overlayStyle = {
            background: `linear-gradient(${overlayAngle}deg, ${rgbaStart}, ${rgbaEnd})`,
        };
    }

    const heightClassMobile = heightMap[heightKey] || 'min-h-[calc(100vh-5rem)]';
    const heightClassDesktop = desktopHeightMap[heightKeyDesktop] || 'md:min-h-[calc(100vh-5rem)]';
    const heightClass = `${heightClassMobile} ${heightClassDesktop}`;
    const alignClasses = alignMap[textAlign] || 'text-center items-center';

    // Build highlighted title HTML
    const spanHtml = `<span style="color:${highlightColor};font-weight:800;${highlightItalic ? 'font-style:italic;' : ''}font-family:${highlightFont.replace(/'/g, '')};">${highlightText}</span>`;
    const titleHtml = heroTitle
        .replace(highlightText, '%%HIGHLIGHT%%')
        .replace(',', ',<br class="hidden sm:block">')
        .replace('%%HIGHLIGHT%%', spanHtml);

    const titleSizeMap: Record<string, string> = {
        small: 'text-xl sm:text-2xl md:text-3xl lg:text-5xl',
        base: 'text-2xl sm:text-3xl md:text-5xl lg:text-6xl',
        large: 'text-3xl sm:text-4xl md:text-6xl lg:text-7xl',
        xl: 'text-4xl sm:text-5xl md:text-7xl lg:text-8xl',
    };
    const titleSizeClass = titleSizeMap[heroTitleSize] || titleSizeMap['base'];
    const containerMaxWidth = cutoutImageUrl ? 'max-w-7xl' : 'max-w-4xl';
    
    // Border radius map
    const radiusMap: Record<string, string> = {
        none: 'rounded-none',
        md: 'rounded-md',
        xl: 'rounded-xl',
        full: 'rounded-full',
    };
    const borderRadiusClass = radiusMap[ctaBorderRadius] || 'rounded-full';

    return (
        <section
            id="home"
            className={`hero ${heightClass} flex items-center justify-center relative overflow-hidden ${textColorClass} hero-padding`}
            style={sectionStyle}
        >
            {/* Background Video */}
            {bgType === 'video' && bgVideoUrl && (
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src={bgVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

            {/* Overlay (for image/video mode) */}
            {(bgType === 'image' || bgType === 'video') && (
                <div className="absolute inset-0 z-0" style={overlayStyle} />
            )}

            <div className={`container relative z-10 px-6 md:px-4 ${containerMaxWidth} mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${cutoutPosition === 'left' && cutoutImageUrl ? 'md:flex-row-reverse' : ''}`}>
                <div className={`flex flex-col flex-1 w-full ${alignClasses}`}>
                    {/* Badge */}
                    {badgeText && (
                        <span 
                            className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-widest backdrop-blur-sm"
                            style={{
                                color: badgeColor,
                                backgroundColor: hexToRgba(badgeColor, 20),
                                borderColor: hexToRgba(badgeColor, 40),
                                borderWidth: '1px'
                            }}
                        >
                            {badgeText}
                        </span>
                    )}

                    <h1 
                        className={`${titleSizeClass} font-bold content-gap ${titleShadowClass} leading-tight`}
                    >
                        <span dangerouslySetInnerHTML={{ __html: titleHtml }} style={titleStyle} />
                    </h1>

                    <p className={`text-sm sm:text-base md:text-lg lg:text-xl ${subtitleColorClass} max-w-2xl content-gap ${subtitleShadowClass} px-2`}>
                        {heroSubtitle}
                    </p>

                    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${textAlign === 'center' ? 'justify-center' : textAlign === 'left' ? 'justify-start' : 'justify-end'}`}>
                        <a 
                            href={ctaPrimaryLink} 
                            style={{ 
                                backgroundColor: ctaPrimaryColor,
                                color: getContrastColor(ctaPrimaryColor) === 'black' ? '#000000' : '#ffffff',
                                borderColor: ctaPrimaryColor
                            }}
                            className={`px-6 sm:px-8 py-2.5 sm:py-3 ${borderRadiusClass} font-semibold hover:opacity-90 border-2 transition-all text-sm sm:text-base text-center`}
                        >
                            {ctaPrimary}
                        </a>
                        <a 
                            href={ctaSecondaryLink} 
                            style={{ 
                                backgroundColor: ctaSecondaryColor,
                                color: getContrastColor(ctaSecondaryColor) === 'black' ? '#000000' : '#ffffff',
                                borderColor: ctaSecondaryColor
                            }}
                            className={`px-6 sm:px-8 py-2.5 sm:py-3 ${borderRadiusClass} font-semibold hover:opacity-90 border-2 transition-all text-sm sm:text-base text-center`}
                        >
                            {ctaSecondary}
                        </a>
                    </div>
                </div>

                {cutoutImageUrl && (
                    <div className={`${currentSize.flex} w-full mt-4 md:mt-0 perspective-1000 relative`}>
                        <div className="relative inline-block w-full">
                            <img 
                                src={cutoutImageUrl} 
                                alt="Hero Cutout" 
                                className={`w-full ${currentSize.maxW} mx-auto object-contain drop-shadow-2xl animate-fade-in-up scale-105 sm:scale-100 transition-transform`} 
                                style={{ maxHeight: currentSize.maxH }}
                            />

                            {/* Overlay Card */}
                            {overlayCardShow && (
                                <div className={`absolute ${overlayPosClass} z-20 w-full max-w-[180px] sm:max-w-[240px] hero-card-pulse`}>
                                    <style dangerouslySetInnerHTML={{ __html: `
                                        .hero-card-pulse {
                                            animation: expand-contract 20s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
                                            transform-origin: ${overlayCardPos.includes('bottom') ? 'bottom' : 'top'} ${overlayCardPos.includes('left') ? 'left' : 'right'};
                                        }
                                        @keyframes expand-contract {
                                            0%, 100% { transform: scale(0); opacity: 0; pointer-events: none; }
                                            5%, 45% { transform: scale(1); opacity: 1; pointer-events: auto; }
                                            50% { transform: scale(0); opacity: 0; pointer-events: none; }
                                        }
                                    `}} />
                                    <div className="bg-white/75 dark:bg-zinc-900/75 backdrop-blur-xl p-2 sm:p-2 rounded-xl sm:rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/50 dark:border-zinc-800/50 flex flex-col gap-1 sm:gap-1">
                                        <div className="flex items-center gap-2 sm:gap-2">
                                            <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <i className={`${overlayCardIcon} text-sm sm:text-lg`}></i>
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-[8px] sm:text-[8px] font-bold text-primary uppercase tracking-widest leading-none mb-0.5 truncate">
                                                    {overlayCardTitle.split(' ')[0]}
                                                </span>
                                                <span className="text-[10px] sm:text-[11px] font-extrabold text-zinc-900 dark:text-white uppercase tracking-tight leading-none truncate">
                                                    {overlayCardTitle.split(' ').slice(1).join(' ') || 'SPECIALIST'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-[9px] sm:text-[9px] text-zinc-600 dark:text-zinc-400 font-medium leading-tight px-1 italic">
                                            {overlayCardText}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
