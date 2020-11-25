import json
from argparse import ArgumentParser
from os import listdir, path, unlink
from subprocess import call

# Constants
app = "generator.jar"
url = "https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.23/swagger-codegen-cli-3.0.23.jar"
format = "typescript-axios"

folder = path.dirname(__file__)

parser = ArgumentParser()
parser.add_argument("-i", type=str, dest="host")
parser.add_argument("-o", type=str, dest="output")

args = parser.parse_args()

api_folder = path.normpath(args.output)


def ensure_typescript_file_content():
    files = list_file_recursively(api_folder, lambda f: ".ts" in f)
    for file in files:
        file_path = path.join(api_folder, file)
        with open(file_path, "r+") as f:
            s = f.read()
            if len(s) == 0:
                f.write("export {}")


def list_file_recursively(p: str, filtering: callable = None) -> list:
    files = listdir(p)

    for f in files:
        file_p = path.join(p, f)
        if path.isdir(file_p):
            files.remove(f)
            files += map(lambda x: path.join(f, x), list_file_recursively(file_p, filtering))
    if filtering is not None:
        files = list(filter(filtering, files))
    return files


def remove_non_typescript_files():
    generated_files = list_file_recursively(api_folder, lambda f: ".ts" not in f)
    for file in generated_files:
        file_path = path.join(api_folder, file)
        if path.isfile(file_path):
            unlink(file_path)


if app not in listdir(folder):
    print(f"Downloading swagger generator from {url})")
    call(f"wsl curl {url} -o {app}")

command = f"java -jar {path.join(folder, app)} generate -i {args.host} -l {format} -o {api_folder} -c " + path.join(folder, "config.json")
print(command)
call(command)

remove_non_typescript_files()
ensure_typescript_file_content()
