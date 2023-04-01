
type Param = {
    params: {
        slug: string
    };
  }

/** @type {import('./$types').PageLoad} */
export function load({ params } : Param) {
    return {
        post: {
            title: `Title for ${params.slug} goes here`,
            content: `Content for ${params.slug} goes here`
        }
    };
}
