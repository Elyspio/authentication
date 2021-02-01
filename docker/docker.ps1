$origin = Get-Location

$DIR = $PSScriptRoot
$ROOT = "$DIR/.."

function removeBuilds()
{
    rm -Recurse -Force $ROOT/back/build
    rm -Recurse -Force $ROOT/front/build
}


Copy-Item "$DIR/Dockerfile" "$DIR/../Dockerfile"

Set-Location $ROOT/back
npm run build

Set-Location $ROOT/front
npm run build

cp "$DIR/Dockerfile" "$DIR/../Dockerfile"
cd $ROOT; docker buildx build --platform "linux/amd64,linux/arm64"  -f ./Dockerfile -t elyspio/authentication --push .
rm "$DIR/../Dockerfile"

removeBuilds
cd $origin

