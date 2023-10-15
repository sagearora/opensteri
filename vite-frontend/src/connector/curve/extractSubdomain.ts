function extractSubdomain(url: string): string | null {
    // Use a regex to match the pattern, capturing the subdomain
    const match = url.match(/^https?:\/\/([\w-]+)\.curvehero\.com$/);

    // If the pattern is matched, return the captured subdomain
    if (match && match[1]) {
        return match[1];
    }

    // If the URL doesn't match the pattern, return null
    return null;
}

export default extractSubdomain;