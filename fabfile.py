from fabric.api import *

@hosts('mnmly.com')
def deploy():
    code_dir = '/var/www/vhosts/tagcloud.mnmly.com'
    with cd(code_dir):
        run("sudo git pull origin master")
        #run('node src/r.js -o name=main out=noun_project/core/static/js/main-built.js baseUrl=noun_project/core/static/js')
        run("forever restart -c coffee app.coffee")
