#!/usr/bin/env python3
"""Assemble index.html from src/ on the shared walk engine: shell + word splits (SEG) + dictionary (LEX) + line English + chapter
registry + the village art + the chapter kit + the chapters (src/chapters/cN.js) + game settings + engine.

Japanese has no spaces, so every Japanese string in the chapters is split into words here with MeCab (fugashi + unidic-lite):
SEG[line] = [[word as written, reading, dictionary form or '' (punctuation)], …]. The engine draws those words as tappable spans
with furigana (src/game.js FURI). A word's dictionary form is looked up in the chapter's DICT, then lexicon/defs.json
({form: {r: reading, k: simple Japanese, e: English}}); lexicon/fixes.json overrides how a word is split or which form it maps to.
The build lists every dictionary form with no definition, and every line with no English (src/lines-en.json)."""
import pathlib,re,sys,json,hashlib,datetime
root=pathlib.Path(__file__).parent
shell=(root/'src/shell.html').read_text(encoding='utf-8')
chs=sorted((root/'src/chapters').glob('c*.js'),key=lambda p:int(re.search(r'\d+',p.stem).group()))
JP=re.compile(r'[ぁ-んァ-ヶー一-龯々]')

# ---------- every Japanese string the game shows ----------
def strings(src):
    out=[]
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`",src):
        s=m.group(1) if m.group(1) is not None else m.group(2)
        if s is None or '${' in s or not JP.search(s):continue
        out.append(s.replace("\\'","'"))
    return out
texts=[]
for p in [*chs,root/'src/village.js',root/'src/kit.js']:
    texts+=strings(re.sub(r"const DICT=\{.*?\n\};","",p.read_text(encoding='utf-8'),flags=re.S))  # the word help shows DICT as it is
texts=list(dict.fromkeys(texts))

# ---------- split into words ----------
import fugashi
tagger=fugashi.Tagger()
fixes=json.loads((root/'lexicon/fixes.json').read_text(encoding='utf-8')) if (root/'lexicon/fixes.json').exists() else {}
FORM=fixes.get('form',{})  # word as written → dictionary form (ください → ください, not くださる)
JOIN=set(fixes.get('join',[]))
READ=fixes.get('read',{})  # readings MeCab gets wrong when it joins numbers and counters (一回 → いっかい)  # words MeCab splits that are one word for a learner (いただきます, ごちそうさま…)
kata=lambda s:''.join(chr(ord(c)-0x60) if 'ァ'<=c<='ン' else c for c in s)
def split(t):
    toks=[]
    for w in tagger(t):
        f=w.feature;pos=f.pos1 or '';kana=f.kana or ''
        if w.surface in ('___','_'):kana=''
        toks.append({'w':w.surface,'r':kata(kana) if kana and kana!='*' else '','pos':pos,'pos2':f.pos2 or '','base':f.orthBase if f.orthBase and f.orthBase!='*' else w.surface,'ws':w.white_space})
    # join: お/ご + noun (おちゃ), a verb or adjective + its endings (のみます, おいしかった), a number + counter (二つ)
    out=[]
    for t_ in toks:
        prev=out[-1] if out else None
        glue=prev and not t_['ws'] and (
            (prev['pos']=='接頭辞' and t_['pos'] in ('名詞','代名詞')) or
            (prev['pos'] in ('動詞','形容詞','助動詞') and prev.get('head') in ('動詞','形容詞') and t_['pos']=='助動詞' and t_['w']!='です') or
            (prev['pos'] in ('動詞','形容詞','助動詞') and prev.get('head') in ('動詞','形容詞') and t_['pos']=='助詞' and t_['pos2']=='接続助詞' and t_['w'] in ('て','で')) or
            (prev['pos']=='名詞' and prev['pos2']=='数詞' and t_['pos']=='接尾辞'))
        if glue:
            prev['w']+=t_['w'];prev['r']+=t_['r'] or t_['w'];prev['pos']=t_['pos'] if t_['pos']=='助動詞' else prev['pos']
            if prev.get('head')!='動詞' and prev.get('head')!='形容詞':prev['base']=prev['w']
            continue
        t_['head']=t_['pos'];out.append(t_)
    # fixes: words to join back together
    res=[]
    for t_ in out:
        if res and (res[-1]['w']+t_['w']) in JOIN or (res and any(j.startswith(res[-1]['w']+t_['w']) and res[-1].get('open') for j in JOIN)):
            res[-1]['w']+=t_['w'];res[-1]['r']+=t_['r'] or t_['w'];res[-1]['base']=res[-1]['w'];res[-1]['open']=res[-1]['w'] not in JOIN;continue
        t_['open']=any(j.startswith(t_['w']) and j!=t_['w'] for j in JOIN);res.append(t_)
    seg=[]
    for t_ in res:
        if t_['ws']:seg.append([t_['ws'],'',''])  # the spaces between words (MeCab keeps them apart from the words)
        punct=t_['pos'] in ('補助記号','空白','記号') or not JP.search(t_['w'])
        form='' if punct else FORM.get(t_['w'],t_['base'])
        seg.append([t_['w'],READ.get(t_['w']) or t_['r'] if JP.search(t_['w']) and re.search(r'[一-龯々]',t_['w']) else '',form])
    return seg
SEG={t:split(t) for t in texts}

# ---------- dictionary ----------
defs=json.loads((root/'lexicon/defs.json').read_text(encoding='utf-8')) if (root/'lexicon/defs.json').exists() else {}
dict_keys=set()
for p in chs:
    m=re.search(r"const DICT=\{(.*?)\n\};",p.read_text(encoding='utf-8'),re.S)
    if m:dict_keys|=set(re.findall(r"^\s*'([^']+)':\{",m.group(1),re.M))
lexmap={}
for seg in SEG.values():
    for w,r,l in seg:
        if l:lexmap.setdefault(w,[l])
used={l for ls in lexmap.values() for l in ls}
missing=sorted(l for l in used if l not in defs and l not in dict_keys)
(root/'lexicon/missing.txt').write_text(''.join(f'{l}\t{" ".join(sorted({w for w,ls in lexmap.items() if l in ls}))}\n' for l in missing),encoding='utf-8')
lex={'map':lexmap,'defs':{l:d for l,d in defs.items() if l in used}}

# ---------- whole-line English ----------
en_p=root/'src/lines-en.json'
lines_en=json.loads(en_p.read_text(encoding='utf-8')) if en_p.exists() else {}
def en_needed(src):
    """the lines a player reads as lines: not dictionary entries, badge words, answers in a choice or a question's word"""
    src=re.sub(r"const DICT=\{.*?\n\};","",src,flags=re.S)
    src=re.sub(r"(?:const WORDS=|badge:|award:)\[[^\]]*\]","",src)
    src=re.sub(r"\bw:'[^']*'","",src)
    src=re.sub(r"\[\s*'[^']*'\s*,\s*[01]\s*(?=[,\]])","[",src)  # a choice's text (its hint after it stays)
    return strings(src)
spoken=list(dict.fromkeys(t for p in [*chs,root/'src/village.js'] for t in en_needed(p.read_text(encoding='utf-8'))))
no_en=[t for t in spoken if t not in lines_en]
(root/'src/lines-todo.json').write_text(json.dumps(no_en,ensure_ascii=False,indent=0)+'\n',encoding='utf-8')

parts=['<script>\n/* Every Japanese line split into words: [as written, reading, dictionary form] (build.py, MeCab). */\nwindow.SEG='+json.dumps(SEG,ensure_ascii=False,separators=(',',':'))+';\n</script>',
 '<script>\n/* Tap-a-word dictionary: word as written → dictionary forms, and learner definitions (lexicon/). */\nwindow.LEX='+json.dumps(lex,ensure_ascii=False,separators=(',',':'))+';\n</script>',
 '<script>\n/* Each line in English, behind its ? (src/lines-en.json). */\nwindow.LINES_EN='+json.dumps(lines_en,ensure_ascii=False,separators=(',',':'))+';\n</script>',
 '<script>\n/* Chapters register themselves here; each keeps its own save. */\nconst CHAPTERS=[];\n</script>']
parts.append(f'<script>\n{(root/"src/village.js").read_text(encoding="utf-8")}</script>')
parts.append(f'<script>\n{(root/"src/kit.js").read_text(encoding="utf-8")}</script>')
parts+=[f'<script>\n{p.read_text(encoding="utf-8")}</script>' for p in chs]
parts.append(f'<script>\n{(root/"src/game.js").read_text(encoding="utf-8")}</script>')
parts.append(f'<script>\n{(root/"src/engine.js").read_text(encoding="utf-8")}</script>')
out=pathlib.Path(sys.argv[sys.argv.index('--out')+1]) if '--out' in sys.argv else root/'index.html'
ver=hashlib.sha256(shell.replace('<!--SCRIPTS-->','\n'.join(parts)).encode('utf-8')).hexdigest()[:8]
vp=root/'version.json'
try: old=json.loads(vp.read_text(encoding='utf-8'))
except Exception: old={}
stamp={'v':ver,'t':old['t'] if old.get('v')==ver and old.get('t') else datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')}
if '--out' not in sys.argv and old!=stamp: vp.write_text(json.dumps(stamp)+'\n',encoding='utf-8')
parts.insert(len(parts)-1,'<script>\n/* This build (version.json): v = a hash of the game, t = when this version first appeared. */\nglobalThis.BUILD='+json.dumps(stamp)+';\n</script>')
out.write_text(shell.replace('<!--SCRIPTS-->','\n'.join(parts)),encoding='utf-8')
print(f'built {out.name} with {len(chs)} chapter(s) · {len(texts)} lines · {len(used)} words, {len(missing)} without a definition (lexicon/missing.txt) · {len(no_en)} lines without English (src/lines-todo.json)')
