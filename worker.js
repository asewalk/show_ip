// Cloudflare Worker to return visitor IP
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 1. Get visitor's real IP from Cloudflare's built-in header
  // "CF-Connecting-IP" is reliable (bypasses proxies/VPNs if Cloudflare is your DNS)
  const visitorIp = request.headers.get('CF-Connecting-IP') || 'IP not found';

  // 2. Choose response format: JSON (for APIs) or HTML (for browser views)
  const acceptHeader = request.headers.get('Accept') || '';
  let response;

  if (acceptHeader.includes('application/json')) {
    // Return JSON (e.g., for tools/scripts)
    response = new Response(JSON.stringify({ your_ip: visitorIp }, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Allow cross-origin requests (optional)
      }
    });
  } else {
    // Return simple HTML page (for when users visit the Worker URL in a browser)
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Your IP Address</title></head>
        <body style="font-family: Arial; text-align: center; margin-top: 50px;">
          <h1>Your Public IP Address</h1>
          <p style="font-size: 20px; color: #2c3e50;">${visitorIp}</p>
        </body>
      </html>
    `;
    response = new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  return response;
}
