const mix = require('laravel-mix');

mix
	.sourceMaps(false, "source-map")
	.setPublicPath(mix.inProduction() ? "dist" : "dev")
	.js("src/GeoLocoMap.js", "geo-loco-map.js");


if (!mix.inProduction()) {
	mix.sass("src/style.scss", "style.css");
}