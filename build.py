#!/usr/bin/env python3
"""Rigenera knowledge.js, anteprima.html, aura-funnel-artifact.html e il pacchetto Vercel da index.html + data.js + knowledge.txt."""
import re, json, os, shutil, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
kb=open('knowledge.txt',encoding='utf8').read().strip()
open('knowledge.js','w',encoding='utf8').write("// Generato da build.py a partire da knowledge.txt. Non modificare a mano.\n(function(r){if(typeof module==='object'&&module.exports){module.exports=r;}else{window.KB=r;}})("+json.dumps(kb,ensure_ascii=False)+");\n")
idx=open('index.html',encoding='utf8').read()
data=open('data.js',encoding='utf8').read()
kbjs=open('knowledge.js',encoding='utf8').read()
style=re.search(r'<style>.*?</style>',idx,re.S).group(0)
app=re.search(r'<script>\n(.*)\n</script>\n</body>',idx,re.S).group(1)
fonts='''<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">'''
body='<main id="app"><p class="mute">Caricamento…</p></main>\n<script>\n'+data+'\n</script>\n<script>\n'+kbjs+'\n</script>\n<script>\n'+app+'\n</script>\n'
art_style=style.replace("main{max-width:720px;margin:0 auto;padding:14px 16px 64px}","main{max-width:720px;margin:0 auto;padding-block:14px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}")
assert art_style!=style
open('aura-funnel-artifact.html','w',encoding='utf8').write('<title>Aura Club Social Funnel</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'+fonts+'\n'+art_style+'\n'+body)
head=idx[:idx.index('<style>')]
open('anteprima.html','w',encoding='utf8').write(head+style+'\n</head>\n<body>\n'+body+'</body>\n</html>\n')
shutil.rmtree('pkg/social-funnel',ignore_errors=True)
os.makedirs('pkg/social-funnel/api')
for f in ['index.html','data.js','knowledge.js','README.md','REFRESH_TASK.md','vercel.json']:
    shutil.copy(f,'pkg/social-funnel/'+f)
shutil.copy('api/ask.js','pkg/social-funnel/api/ask.js')
if os.path.exists('social-funnel-vercel.zip'): os.remove('social-funnel-vercel.zip')
subprocess.check_call(['zip','-qr','../social-funnel-vercel.zip','social-funnel'],cwd='pkg')
print('ok')
