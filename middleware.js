// middleware.js
const { NextResponse } = require("next/server");

// This function can be marked `async` if using `await` inside
function middleware(request) {
    const url = request.nextUrl;
    url.pathname = "/api/sitemap";
    return NextResponse.rewrite(url);
}

module.exports.middleware = middleware;

module.exports.config = {
    matcher: [
        /* Match all sitemap paths */
        "/([\\w\\d_-]*sitemap[\\w\\d_-]*.xml)/",
    ],
};
