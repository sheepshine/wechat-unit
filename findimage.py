import os
import os.path
rootdir ='src\images'
def forfile(rootdir):
	'''遍历图片文件夹下的图片文件名
	   创建imgarr.txt
	便于项目loading使用'''
	for root,dir,files in os.walk(rootdir):
		imgarr=[]
		for fn in files:
			imgarr.append(fn)
		f=open("imgarr.txt","a")
		imgarr=','.join(imgarr)
		f.write(imgarr)
forfile(rootdir)