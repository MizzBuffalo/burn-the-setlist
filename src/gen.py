import json, os, re
here = os.path.dirname(os.path.abspath(__file__))
rows = json.load(open(os.path.join(here, 'rows.json')))
# rows: [section, artist, song, known, note]
songs = []
for i, (sec, art, song, known, note) in enumerate(rows):
    songs.append(dict(id=i, s=sec, a=art, t=song, k=known, n=note))
life={}
for line in open(os.path.join(here,'lifetime.txt'),encoding='utf-8'):
    if '|' in line:
        t,c=line.rsplit('|',1); life[t.strip()]=int(c)
def norm(x): return re.sub(r'\s+',' ',re.sub(r"[^a-z0-9' ]",' ',x.lower().replace('’',"'"))).strip()
lifen={norm(k):v for k,v in life.items()}
hit=0
for x in songs:
    v=lifen.get(norm(x['t']))
    if v is not None: x['l']=v; hit+=1
print('lifetime matched',hit,'of',len(life))
shows = json.load(open(os.path.join(here, 'shows.json')))
bust = json.load(open(os.path.join(here, 'bustouts.json')))
open(os.path.join(here, '..', 'data.js'), 'w', encoding='utf-8').write(
    "window.SONGS=" + json.dumps(songs, ensure_ascii=False, separators=(',', ':')) +
    ";\nwindow.SHOWS=" + json.dumps(shows, ensure_ascii=False, indent=1) + ";\nwindow.BUSTOUTS=" + json.dumps(bust, ensure_ascii=False) + ";\n")
print(len(songs), "songs,", len(shows), "shows")
