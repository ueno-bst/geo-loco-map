<?php

$lat_range = [32, 38, 30];
$lng_range = [133, 139, 10];

$data = [];

for ( $y = 0; $y < $lat_range[2]; $y++ ) {
	$lat = ($lat_range[1] - $lat_range[0]) / $lat_range[2] * $y + $lat_range[0];

	for ( $x = 0; $x < $lng_range[2]; $x++ ) {
		$lng = ($lng_range[1] - $lng_range[0]) / $lng_range[2] * $x + $lng_range[0];

		$datum = [
			'id'         => "id#{$y}-{$x}",
			'label'      => "#{$y}:{$x}",
			'coordinate' => [$lat, $lng],
		];

		$data[] = $datum;
	}
}


$json = json_encode( ['data' => $data], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );

$file = __DIR__ . DIRECTORY_SEPARATOR . "../sample" . DIRECTORY_SEPARATOR . pathinfo( __FILE__, PATHINFO_FILENAME ) . '.json';

file_put_contents( $file, $json );

