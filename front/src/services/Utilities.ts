
export function imageUrl(image: string | undefined) : string
{
    if (typeof image === 'undefined') {
        return '/image/default.png';
    }

    if ((<string>image).startsWith('http://') || (<string>image).startsWith('https://')) {
        return <string>image;
    }

    return '/' + <string>image;
}
