from PIL import Image,ImageOps,ImageDraw
import sys
step=sys.argv[1];root='docs/implementation/visual/'
sheet=Image.new('RGB',(1110,950),'#ddd')
for row,lang in enumerate(['zh','en']):
 for col,view in enumerate(['desktop','mobile']):
  im=Image.open(f'{root}{step}-{lang}-{view}.png');im.thumbnail((720,450) if col==0 else (390,450));sheet.paste(im,(0 if col==0 else 720,row*475+25));ImageDraw.Draw(sheet).text((0 if col==0 else 720,row*475),f'{step} {lang} {view}',fill='black')
sheet.save(f'/tmp/{step}-sheet.png')
