export enum RestVerb {
   Delete = 'delete',
   Get = 'get',
   Head = 'head',
   Patch = 'patch',
   Post = 'post',
   Put = 'put'
}

export function toRestVerb(verb: string): RestVerb {
   let lower = verb.toLowerCase()

   for(let en of Object.keys(RestVerb)) {
      if(en.toLowerCase() === lower) {
         return RestVerb[en]
      }
   }

   throw new Error(`Unsupported verb ${verb}`)
}

export function sanitizeUrl(url: string): string {
   // Strip off following '/'
   if(url.endsWith('/')) {
      while(url.endsWith('/')) {
         url = url.slice(-1)
      }
   }

   return url
}