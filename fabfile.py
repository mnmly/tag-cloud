from fabric.api import *

@hosts('mnmly.com')
def deploy():
    local("git push origin feature/font")
    code_dir = '/var/www/vhosts/tagcloud.mnmly.com'
    with cd(code_dir):
        run("sudo git pull origin feature/font")
        #run('node src/r.js -o name=main out=noun_project/core/static/js/main-built.js baseUrl=noun_project/core/static/js')
        run("NODE_ENV=production forever restart -c coffee app.coffee")
