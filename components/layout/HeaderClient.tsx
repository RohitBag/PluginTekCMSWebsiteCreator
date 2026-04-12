"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from 'next/link';
import { Heart, User, ChevronDown } from 'lucide-react';
import { getContrastColor } from "@/utils/contrast";

export default function HeaderClient({ initialSettings, initialCustomSections, initialServices }: { initialSettings: any[], initialCustomSections?: any[], initialServices?: any[] }) {
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState('light');
    const [settings, setSettings] = useState<any[]>(initialSettings || []);
    const [customSections, setCustomSections] = useState<any[]>(initialCustomSections || []);
    const [services, setServices] = useState<any[]>(initialServices || []);
    const [maxItems, setMaxItems] = useState(6);

    // Initialize theme based on localStorage or preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        applyTheme(savedTheme);

        // Auth check & Settings
        const supabase = createClient();
        
        // Fetch settings
        supabase.from('site_settings').select('*').then(({ data }) => {
            if (data) setSettings(data);
        });

        // Fetch custom sections
        supabase.from('custom_sections').select('id, title, display_order').order('display_order', { ascending: true }).then(({ data }) => {
            if (data) setCustomSections(data);
        });

        // Fetch services
        supabase.from('services').select('id, title, page_url').order('title', { ascending: true }).then(({ data }) => {
            if (data) setServices(data);
        });

        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 850) {
                setMaxItems(2);
            } else if (window.innerWidth < 1024) {
                setMaxItems(4);
            } else if (window.innerWidth < 1150) {
                setMaxItems(6);
            } else {
                setMaxItems(8); // Increased max items to remove 'More' wrapper essentially
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getSetting = (key: string) => settings.find(s => s.key === key)?.value;
    
    const headerConfig = getSetting('header_menu_config') || {
        items: {},
        desktop: { fontSize: '16', alignment: 'right', fontFamily: 'Outfit' },
        mobile: { fontSize: '14', alignment: 'left', fontFamily: 'Outfit' },
        moreLabel: 'More'
    };

    const applyTheme = (themeName: string) => {
        if (themeName === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    const navLabels: Record<string, string> = {
        home: getSetting('nav_home_label') || 'Home',
        featured: getSetting('nav_featured_label') || 'Featured',
        services: getSetting('nav_services_label') || 'Services',
        portfolio: getSetting('nav_portfolio_label') || 'Portfolio',
        contact: getSetting('nav_contact_label') || 'Contact',
    };

    // Build the dynamic nav items array based on home_layout and custom sections
    const defaultLayout = [
        { id: "hero", enabled: true },
        { id: "about", enabled: true },
        { id: "items", enabled: true },
        { id: "services", enabled: true },
        { id: "portfolio", enabled: true },
        ...customSections.map(cs => ({ id: `custom_section_${cs.id}`, enabled: true })),
        { id: "contact", enabled: true },
    ];
    let homeLayout = getSetting('home_layout') || defaultLayout;
    if (typeof homeLayout === 'string') {
        try { homeLayout = JSON.parse(homeLayout); } catch (e) { homeLayout = defaultLayout; }
    }

    // Add Login, Wishlist, Profile to homeLayout if they exist in headerConfig or as defaults
    const extendedLayout = [...homeLayout];
    ['login', 'wishlist', 'profile'].forEach(id => {
        if (!extendedLayout.find(item => item.id === id)) {
            extendedLayout.push({ id, enabled: true });
        }
    });

    const allNavItems = extendedLayout
        .filter((s: any) => s.enabled && s.id !== "custom")
        .map((s: any) => {
            let href = `/#${s.id}`;
            let label = s.label || s.id;
            let icon: React.ReactNode = null;

            let subItems: { label: string, href: string }[] | undefined = undefined;

            if (s.id === "hero") {
                href = "/#home";
                label = navLabels.home;
            } else if (s.id === "about") {
                label = "About";
            } else if (s.id === "items") {
                label = navLabels.featured;
            } else if (s.id === "services") {
                label = navLabels.services;
            } else if (s.id === "portfolio") {
                label = navLabels.portfolio;
            } else if (s.id === "contact") {
                label = "Contact Us";
            } else if (s.id === "login") {
                href = "/login";
                label = user ? "Logout" : "Login";
            } else if (s.id === "wishlist") {
                href = "/bookmarks";
                label = "Wishlist";
                icon = <Heart size={18} />;
            } else if (s.id === "profile") {
                href = "/profile";
                label = "Profile";
                icon = <User size={18} />;
            } else if (s.id.startsWith("custom_section_")) {
                const sectionId = s.id.replace("custom_section_", "");
                href = `/#section-${sectionId}`;
                const cs = customSections.find(c => c.id.toString() === sectionId);
                if (cs) {
                    label = cs.title;
                    if ((cs.title === "Our Treatments" || cs.title === "Treatments") && services && services.length > 0) {
                        label = "Treatments";
                        subItems = services.map(svc => ({
                            label: svc.title,
                            href: svc.page_url || `/p/${svc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                        }));
                    }
                }
            }
            return { id: s.id, href, label, subItems, icon };
        });

    // Sort items if custom order is defined
    if (headerConfig.order && Array.isArray(headerConfig.order)) {
        allNavItems.sort((a: any, b: any) => {
            const indexA = headerConfig.order.indexOf(a.id);
            const indexB = headerConfig.order.indexOf(b.id);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }

    const getVisibility = (id: string, platform: 'desktop' | 'mobile') => {
        return headerConfig.items[id]?.[platform] || 'show';
    };

    const desktopVisible = allNavItems.filter(item => getVisibility(item.id, 'desktop') === 'show');
    const desktopMore = allNavItems.filter(item => getVisibility(item.id, 'desktop') === 'more');
    
    const mobileVisible = allNavItems.filter(item => getVisibility(item.id, 'mobile') === 'show');
    const mobileMore = allNavItems.filter(item => getVisibility(item.id, 'mobile') === 'more');

    const headerBg = getSetting('header_bg_color') || '#ffffff';
    const headerText = getContrastColor(headerBg) === 'black' ? 'text-black' : 'text-white';
    
    const desktopStyle = {
        fontSize: `${headerConfig.desktop.fontSize || '16'}px`,
        fontFamily: headerConfig.desktop.fontFamily ? `'${headerConfig.desktop.fontFamily}', sans-serif` : 'inherit'
    };

    const mobileStyle = {
        fontSize: `${headerConfig.mobile.fontSize || '14'}px`,
        fontFamily: headerConfig.mobile.fontFamily ? `'${headerConfig.mobile.fontFamily}', sans-serif` : 'inherit'
    };

    const alignmentClass = {
        left: 'justify-start mr-auto',
        center: 'justify-center mx-auto',
        right: 'justify-end ml-auto'
    }[headerConfig.desktop.alignment as 'left' | 'center' | 'right'] || 'justify-end ml-auto';

    return (
        <>
            <header 
                className={`fixed top-0 w-full z-50 py-3 backdrop-blur-md shadow-sm transition-all duration-300 ${headerText}`}
                style={{ backgroundColor: `${headerBg}b3` }} // adding b3 for 70% opacity
            >
                <div className="container mx-auto flex justify-between items-center px-4">
                    <div className="logo h-14 w-auto shrink-0 max-w-[180px] md:max-w-none flex items-center">
                        <a href="/" className="h-full flex items-center">
                            {getSetting('logo_type') === 'text' ? (
                                <span 
                                    className="transition-all duration-300"
                                    style={{
                                        fontFamily: getSetting('logo_text_font') ? `'${getSetting('logo_text_font')}', sans-serif` : 'inherit',
                                        fontSize: `${getSetting('logo_text_size') || '24'}px`,
                                        fontWeight: getSetting('logo_text_weight') || '700',
                                        color: theme === 'dark' ? (getSetting('logo_text_color_dark') || '#ffffff') : (getSetting('logo_text_color_light') || '#000000'),
                                        textShadow: theme === 'dark' ? (getSetting('logo_text_shadow_dark') || 'none') : (getSetting('logo_text_shadow_light') || 'none'),
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {getSetting('logo_text') || getSetting('site_name') || 'Brand'}
                                </span>
                            ) : (
                                <>
                                    <img 
                                        src={getSetting('site_logo_url') || '/website_logo.png'} 
                                        alt={`${getSetting('site_name') || 'Site'} Logo`} 
                                        className="h-full object-contain transition-all duration-300 dark:hidden" 
                                        style={{ 
                                            filter: `brightness(${getSetting('logo_light_brightness') || '1'}) grayscale(${getSetting('logo_light_grayscale') || '0'}) ${getSetting('logo_light_drop_shadow') && getSetting('logo_light_drop_shadow') !== 'none' ? `drop-shadow(${getSetting('logo_light_drop_shadow')})` : ''}` 
                                        }}
                                    />
                                    <img 
                                        src={getSetting('site_logo_inverted_url') || '/website_logo_Inverted.png'} 
                                        alt={`${getSetting('site_name') || 'Site'} Logo Inverted`} 
                                        className="h-full object-contain transition-all duration-300 hidden dark:block" 
                                        style={{ 
                                            filter: `brightness(${getSetting('logo_dark_brightness') || '1'}) grayscale(${getSetting('logo_dark_grayscale') || '0'}) ${getSetting('logo_dark_drop_shadow') && getSetting('logo_dark_drop_shadow') !== 'none' ? `drop-shadow(${getSetting('logo_dark_drop_shadow')})` : ''}` 
                                        }}
                                    />
                                </>
                            )}
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div
                        className={`md:hidden text-2xl cursor-pointer ${headerText}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </div>

                    {/* Desktop Nav */}
                    <ul className={`hidden md:flex gap-4 lg:gap-8 items-center flex-1 ${alignmentClass}`}>
                        <NavItemsDesktop 
                            items={desktopVisible} 
                            moreItems={desktopMore}
                            moreLabel={headerConfig.moreLabel}
                            textColor={headerText} 
                            headerBg={headerBg} 
                            customStyle={desktopStyle}
                        />
                    </ul>

                    {/* Mobile Nav */}
                    <div 
                        className={`md:hidden fixed top-[80px] left-0 w-full shadow-2xl transition-all duration-300 flex flex-col items-start py-8 gap-6 overflow-y-auto max-h-[calc(100vh-80px)] z-[100] ${isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'} ${headerText === 'text-white' ? 'bg-zinc-900' : 'bg-white'}`}
                    >
                        <div className="w-full px-8" style={{ textAlign: headerConfig.mobile.alignment as any }}>
                            <ul className={`flex flex-col gap-6 w-full ${headerConfig.mobile.alignment === 'center' ? 'items-center' : headerConfig.mobile.alignment === 'right' ? 'items-end' : 'items-start'}`}>
                                <NavItemsMobile 
                                    items={mobileVisible} 
                                    moreItems={mobileMore}
                                    moreLabel={headerConfig.moreLabel}
                                    textColor={headerText} 
                                    onClick={() => setIsMenuOpen(false)} 
                                    customStyle={mobileStyle}
                                />
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            {/* Floating Theme Toggle */}
            <div className="fixed bottom-6 left-6 z-[60]">
                <button 
                    onClick={toggleTheme} 
                    className={`flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-md border border-white/20 ${theme === 'dark' ? 'bg-zinc-800/40 text-yellow-400' : 'bg-white/40 text-zinc-900'}`}
                    aria-label="Toggle Theme"
                >
                    <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} text-sm`}></i>
                </button>
            </div>
        </>
    );
}

function NavItemsDesktop({ items, moreItems, moreLabel, textColor, headerBg, customStyle }: { items: any[]; moreItems: any[]; moreLabel?: string; textColor: string; headerBg: string; customStyle: any }) {
    const isDarkBg = getContrastColor(headerBg) === 'white';

    const renderItem = (item: any) => {
        const isLoginButton = item.id === 'login' && item.label === 'Login';
        if (isLoginButton) {
            return (
                <li key={item.id}>
                    <Link 
                        href={item.href} 
                        style={customStyle}
                        className={`${getContrastColor(headerBg) === 'black' ? 'bg-black text-white' : 'bg-white text-black'} px-4 py-2 rounded-md border-radius-5 text-sm font-semibold hover:opacity-80 transition-opacity`}
                    >
                        {item.label}
                    </Link>
                </li>
            );
        }

        return (
            <li key={item.id} className={item.subItems ? "relative group" : ""}>
                <a 
                    href={item.href} 
                    style={customStyle}
                    className={`flex items-center gap-1 ${textColor} font-medium hover:text-primary transition-colors relative group whitespace-nowrap`}
                >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label} {item.subItems && <ChevronDown size={14} className="ml-0.5 opacity-70" />}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </a>
                {item.subItems && (
                    <div className="absolute left-0 top-full hidden group-hover:block pt-4 z-50">
                        <ul className={`flex flex-col shadow-xl rounded-lg py-2 min-w-[220px] border ${isDarkBg ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
                            {item.subItems.map((sub: any, idx: number) => (
                                <li key={idx}>
                                    <a href={sub.href} className={`block px-5 py-2.5 transition-colors ${isDarkBg ? 'hover:bg-zinc-800 hover:text-primary' : 'hover:bg-gray-50 hover:text-primary'}`}>
                                        {sub.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </li>
        );
    };

    return (
        <>
            {items.map(renderItem)}
            {moreItems.length > 0 && (
                <li className="relative group">
                    <button className={`flex items-center gap-1 ${textColor} font-medium hover:text-primary transition-colors relative group whitespace-nowrap`} style={customStyle}>
                        {moreLabel || 'More'} <ChevronDown size={14} className="ml-0.5 opacity-70" />
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </button>
                    <div className="absolute right-0 top-full hidden group-hover:block pt-4 z-50">
                        <ul className={`flex flex-col shadow-xl rounded-lg py-2 min-w-[200px] border ${isDarkBg ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
                            {moreItems.map((item: any) => (
                                <li key={item.id} className="relative group/sub">
                                    <a 
                                        href={item.href} 
                                        className={`flex items-center gap-2 px-5 py-2.5 transition-colors ${isDarkBg ? 'hover:bg-zinc-800 hover:text-primary' : 'hover:bg-gray-50 hover:text-primary'}`}
                                    >
                                        {item.icon}
                                        {item.label}
                                        {item.subItems && <ChevronDown size={14} className="ml-auto opacity-70 -rotate-90" />}
                                    </a>
                                    {item.subItems && (
                                        <div className="absolute left-full top-0 hidden group-hover/sub:block pl-2">
                                            <ul className={`flex flex-col shadow-xl rounded-lg py-2 min-w-[200px] border ${isDarkBg ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
                                                {item.subItems.map((sub: any, idx: number) => (
                                                    <li key={idx}>
                                                        <a href={sub.href} className={`block px-5 py-2.5 transition-colors ${isDarkBg ? 'hover:bg-zinc-800 hover:text-primary' : 'hover:bg-gray-50 hover:text-primary'}`}>
                                                            {sub.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>
            )}
        </>
    );
}

function NavItemsMobile({ onClick, items, moreItems, moreLabel, textColor, customStyle }: { onClick?: () => void; items: any[]; moreItems: any[]; moreLabel?: string; textColor: string; customStyle: any }) {
    const renderItem = (item: any, isSub = false) => {
        const isLoginButton = item.id === 'login' && item.label === 'Login';
        
        return (
            <li key={item.id} className={`w-full flex flex-col group ${isSub ? 'mt-3 ml-4' : ''}`}>
                {isLoginButton ? (
                    <Link 
                        href={item.href} 
                        onClick={onClick}
                        style={customStyle}
                        className={`${textColor === 'text-white' ? 'bg-white text-black' : 'bg-black text-white'} px-6 py-2.5 rounded-md border-radius-5 text-sm font-semibold hover:opacity-80 transition-opacity w-fit`}
                    >
                        Login / Register
                    </Link>
                ) : (
                    <>
                        <a 
                            href={item.href} 
                            onClick={onClick} 
                            style={customStyle}
                            className={`${textColor} font-medium hover:text-primary transition-colors relative whitespace-nowrap flex items-center gap-2`}
                        >
                            {item.icon}
                            {item.label} {item.subItems && <ChevronDown size={14} className="ml-0.5 opacity-70" />}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </a>
                        {item.subItems && (
                            <ul className="flex flex-col items-start mt-3 gap-3 ml-4">
                                {item.subItems.map((sub: any, idx: number) => (
                                    <li key={idx}>
                                        <a href={sub.href} onClick={onClick} className={`${textColor} text-sm font-medium hover:text-primary transition-colors opacity-80`}>
                                            {sub.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </li>
        );
    };

    return (
        <>
            {items.map(item => renderItem(item))}
            {moreItems.length > 0 && (
                <li className="w-full flex flex-col items-start group">
                    <span className={`${textColor} font-bold text-xs uppercase tracking-widest opacity-40 mb-2 mt-4`}>
                        {moreLabel || 'More'}
                    </span>
                    <ul className="flex flex-col gap-4 w-full">
                        {moreItems.map(item => renderItem(item, true))}
                    </ul>
                </li>
            )}
        </>
    );
}
