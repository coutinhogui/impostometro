"""Validate first, then publish an explicit allowlist; editorial material never ships."""
import json, pathlib, shutil, subprocess, os
root = pathlib.Path(__file__).resolve().parents[1]
subprocess.run([os.environ.get('NODE_BINARY','node'), '--test'],cwd=root,check=True)
out=root/'dist'
if out.exists(): shutil.rmtree(out)
out.mkdir()
for name in ['index.html','index_v1.html','index_v2.html']:
    shutil.copy2(root/name,out/name)
for folder in ['assets','data']: shutil.copytree(root/folder,out/folder)
(out/'.nojekyll').touch()
assert not (out/'_editorial').exists()
print('Site validado em dist/; arquivo editorial excluído.')
