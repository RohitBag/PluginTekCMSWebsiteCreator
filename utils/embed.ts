export type EmbedType = 'youtube' | 'instagram' | 'map' | 'generic';

export interface EmbedInfo {
    id: string;
    type: EmbedType;
    url: string;
}

export function getEmbedInfo(content: string): EmbedInfo | null {
    if (!content) return null;
    const trimmed = content.trim();

    // 1. YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = trimmed.match(youtubeRegex);
    if (ytMatch && /youtube\.com|youtu\.be/.test(trimmed)) {
        return {
            id: ytMatch[1],
            type: 'youtube',
            url: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
        };
    }

    // 2. Instagram
    const instagramRegex = /(?:instagram\.com\/(?:reel|p)\/)([^/?#&]+)/;
    const igMatch = trimmed.match(instagramRegex);
    if (igMatch && /instagram\.com/.test(trimmed)) {
        return {
            id: igMatch[1],
            type: 'instagram',
            url: `https://www.instagram.com/reel/${igMatch[1]}/embed/`
        };
    }

    // 3. Google Maps
    if (/google\.com\/maps\/embed/.test(trimmed)) {
        const srcMatch = trimmed.match(/src="([^"]+)"/) || [null, trimmed];
        return {
            id: 'map',
            type: 'map',
            url: srcMatch[1] || trimmed
        };
    }

    // 4. Generic Iframe Tag
    if (trimmed.startsWith('<iframe')) {
        const srcMatch = trimmed.match(/src="([^"]+)"/);
        if (srcMatch) {
            return {
                id: 'generic',
                type: 'generic',
                url: srcMatch[1]
            };
        }
    }

    // 5. Generic URL that looks like an embed
    if (trimmed.startsWith('http') && !trimmed.includes(' ')) {
        // Simple heuristic: if it contains 'embed', 'widget', or 'player' and it's a single URL
        if (/embed|widget|player/.test(trimmed)) {
            return {
                id: 'generic',
                type: 'generic',
                url: trimmed
            };
        }
    }

    return null;
}
