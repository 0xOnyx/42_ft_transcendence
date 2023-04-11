
type Param = {
    params: {
        slug: string
    };
  }

import { PUBLIC_API_URI } from '$env/static/public';


export async function load() {
    const res = await fetch(`${PUBLIC_API_URI}/auth/islogged`);
    console.log(await res.json());
    return {
        data: {
            uri_redirect: `${PUBLIC_API_URI}/auth`
        }
    };
}
