const WORKER_DNS = "msx-quick.buchclub-gd.workers.dev"


const menuJson = ` 
{
    "headline": "MyMedia",

    "menu": [
    {
            "label": "IPTV Main",
            "data": "http://msx.benzac.de/services/m3u.php?type=video&url=https://raw.githubusercontent.com/jnk22/kodinerds-iptv/master/iptv/kodi/kodi_tv_main.m3u"
        },    {
      "type": "separator"
    },
        {            
            "label": "Playlists",
            "data": {  
                "template": {
                    "type": "control",
                    "layout": "0,0,12,1",
                    "color": "msx-glass"
                },
                "items": [
                    {
                        "icon": "live",
                        "label": "ZDFInfo Dokus",
                        "action": "content:https://mrss2m3u.buchclub-gd.workers.dev/feed?query=ZDFInfo"
                    },
                   {
                        "icon": "live",
                        "label": "Free-IPTV",
                        "action": "content:http://msx.benzac.de/services/m3u.php?type=video&url=https://raw.githubusercontent.com/jnk22/kodinerds-iptv/master/iptv/kodi/kodi_tv_main.m3u"
                    },{
                        "icon": "music",
                        "label": "Radio (DE)t",
                        "action": "content:http://msx.benzac.de/services/m3u.php?type=audio&url=http://bit.ly/kn-kodi-radio-de"
                    }, {     
                        "icon": "music",
                        "label": "Start ARTE Electronic",
                        "action": "playlist:https://mrss2m3u.buchclub-gd.workers.dev/feed?query=Electronic"
                    }, {     
                        "icon": "image",
                        "label": "Show slideshow",
                        "action": "content:http://msx.benzac.de/services/m3u.php?type=image&url=http://msx.benzac.de/info/data/m3u/images.m3u"
                    }, {    
                        "icon": "image",
                        "label": "Start slideshow",
                        "action": "slideshow:http://msx.benzac.de/services/m3u.php?type=image&url=http://msx.benzac.de/info/data/m3u/images.m3u"
                    }]
            }
        },
    {
      "type": "separator"
    },
    {
      "icon": "surround-sound",
      "label": "SoundCloud - Search",
            "background": "https://wallpaperaccess.com/download/soundcloud-1377910",
      "data": "user:http://sc.msx.benzac.de/msx/service.php?type=search"
    },
    {
      "icon": "surround-sound",
    "background": "https://wallpaperaccess.com/download/soundcloud-1377910",
      "badge": "{txt:msx-white:SoundCloud}",
       "badgeColor": "#ff5500",
      "label": "SoundCloud (Top)",
      "data": "user:http://sc.msx.benzac.de/msx/service.php?type=top"
    },
    {
      "icon": "surround-sound",
      "background": "https://wallpaperaccess.com/download/soundcloud-1377910",
      "label": "SoundCloud (Hot)",
      "data": "user:http://sc.msx.benzac.de/msx/service.php?type=trending"
    }
]}
  `

  const startJson = `
{
    "name": "MyTest MSX",
    "version": "1.0.0",
    "parameter": "menu:https://` + WORKER_DNS +`/msx/menu.json",
    "note": "For this service, Media Station X 0.1.97 or higher is needed."
}
  `



/**
 * rawHtmlResponse returns HTML inputted directly
 * into the worker script
 * @param {string} html
 */
function rawHtmlResponse(html) {
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",

    },
  }
  return new Response(html, init)
}
/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {
  const { headers } = request
  const contentType = headers.get("content-type") || ""

  /* We need CORS */
  headers.set("Access-Control-Allow-Origin", "*")
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

  if (contentType.includes("application/json")) {
    return JSON.stringify(await request.json())
  }
  else if (contentType.includes("application/text")) {
    return await request.text()
  }
  else if (contentType.includes("text/html")) {
    return await request.text()
  }
  else if (contentType.includes("form")) {
    const formData = await request.formData()
    const body = {}
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }
    return JSON.stringify(body)
  }
  else {
    const myBlob = await request.blob()
    const objectURL = URL.createObjectURL(myBlob)
    return objectURL
  }
}

const someForm = `
<!DOCTYPE html>
TEMP

  `


 
        
async function handleRequestMSX(request,mime) {
      if (typeof request === 'undefined') {
            return new Response("ERROR");
            
        };
        
    const base = "http://msx.benzac.de";

    const url = new URL(request.url);

    const { pathname, search } = url;
    const destinationURL = base + pathname + search;
  
    const response =  await fetch(destinationURL);
    var html =  await response.text()
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                
    return new Response(html, {
    headers: response.headers,
  })
  return new Response(html)
}


addEventListener("fetch", event => {
  const { request } = event
  const { url } = request

  if (url.includes("form")) {
    return event.respondWith(rawHtmlResponse(someForm))
  }

  if (url.includes("msx/menu.json")) {
    return event.respondWith(rawHtmlResponse(menuJson))
  }  
  if (url.includes("msx/start.json")) {
    return event.respondWith(rawHtmlResponse(startJson))
  }  
  if (url.includes("feed")) {
    return event.respondWith(handleRequest(request))
  } 
  if (url.includes("font")) {
    return event.respondWith(handleRequestMSX(request,'application/font-sfnt'))
  }
  if (url.includes("css")) {
    return event.respondWith(handleRequestMSX(request,'text/css'))
  }
  if (url.includes("js/")) {
    return event.respondWith(handleRequestMSX(request,'text/javascript'))
  }
  if (request.method === "GET") {
    return event.respondWith(handleRequestMSX(request,'text/html'))
  }
//   else if (request.method === "GET") {
//     return event.respondWith(new Response(`The request was a GET`))
//   }
})


/**

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

 async function handleRequest(request) {
  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  })
}
 */
